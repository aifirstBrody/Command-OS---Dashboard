const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const { sendReceiptNotification } = require('../services/slack');

const RECEIPTS_DIR = path.join(__dirname, '../logs/receipts');

const VALID_UNITS = ['lbs', 'oz', 'kg', 'g', 'ea', 'case', 'pallet'];

router.post('/', async (req, res) => {
  const { items, submittedBy, notes } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart must contain at least one item.' });
  }

  // Validate each item
  for (const item of items) {
    if (!item.ingredient || typeof item.ingredient !== 'string' || !item.ingredient.trim()) {
      return res.status(400).json({ error: 'Each item must have an ingredient name.' });
    }
    if (!item.qty || isNaN(Number(item.qty)) || Number(item.qty) <= 0) {
      return res.status(400).json({ error: `Invalid quantity for item: ${item.ingredient}` });
    }
  }

  const receiptId = uuidv4().split('-')[0].toUpperCase();
  const isSandbox = process.env.NODE_ENV !== 'production';

  const receipt = {
    receiptId,
    date: new Date().toISOString(),
    submittedBy: submittedBy || 'unknown',
    sandbox: isSandbox,
    items: items.map(item => ({
      ingredient: item.ingredient.trim(),
      qty: Number(item.qty),
      unit: VALID_UNITS.includes(item.unit) ? item.unit : 'lbs',
      lotNumber: (item.lotNumber || '').trim(),
      notes: (item.notes || '').trim()
    })),
    notes: (notes || '').trim()
  };

  // Save receipt JSON
  const filePath = path.join(RECEIPTS_DIR, `${new Date().toISOString().split('T')[0]}_receipt_${receiptId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(receipt, null, 2), 'utf8');

  // Slack notification — fire and forget
  sendReceiptNotification(receipt).catch(err =>
    console.error('[Receipt] Slack notification failed:', err.message)
  );

  console.log(`[Receipt] ${receiptId} — ${items.length} items — ${isSandbox ? 'SANDBOX' : 'PRODUCTION'} — by ${submittedBy}`);

  res.json({
    success: true,
    receiptId,
    itemCount: items.length,
    sandbox: isSandbox,
    message: `Receipt ${receiptId} submitted${isSandbox ? ' (sandbox — no Acumatica write-back)' : ''}.`
  });
});

module.exports = router;
