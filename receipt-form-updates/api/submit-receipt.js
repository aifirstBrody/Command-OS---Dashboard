/**
 * POST /api/submit-receipt
 *
 * Accepts a full ingredient cart and:
 * 1. Posts one Inventory Receipt to Acumatica with all items in Details[]
 * 2. Checks actual vs expected variance (>5%) per ingredient
 * 3. Sends a mismatch alert email for any ingredient that exceeds the threshold
 *
 * Request body:
 * {
 *   batchId:     string,           -- required
 *   productName: string,
 *   startDate:   string,
 *   dateReceived: string,          -- YYYY-MM-DD, required
 *   ingredients: [                 -- required, min 1
 *     {
 *       ingredientId:   string,    -- required (Acumatica InventoryID)
 *       ingredientName: string,
 *       expectedWeight: number,
 *       actualWeight:   number,    -- required
 *       uom:            string     -- defaults to 'LBS'
 *     },
 *     ...
 *   ]
 * }
 *
 * Response:
 * {
 *   success:       boolean,
 *   receiptPosted: boolean,
 *   receiptNbr:    string | null,
 *   totalItems:    number,
 *   items: [
 *     {
 *       ingredientId:   string,
 *       ingredientName: string,
 *       actualWeight:   number,
 *       expectedWeight: number,
 *       variancePct:    number,
 *       hasMismatch:    boolean,
 *       alertSent:      boolean
 *     },
 *     ...
 *   ],
 *   receiptError: string | undefined
 * }
 */

const { getAccessToken } = require('./auth');
const { sendMismatchAlert } = require('./send-mismatch-alert');

const VARIANCE_THRESHOLD = 5; // percent

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { batchId, productName, startDate, dateReceived, ingredients } = req.body;

    // ── Validate top-level fields ──────────────────────────────────────────────
    if (!batchId || typeof batchId !== 'string' || !batchId.trim()) {
      return res.status(400).json({ error: 'batchId is required.' });
    }
    if (!dateReceived || typeof dateReceived !== 'string') {
      return res.status(400).json({ error: 'dateReceived is required (YYYY-MM-DD).' });
    }
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'ingredients must be a non-empty array.' });
    }
    if (ingredients.length > 50) {
      return res.status(400).json({ error: 'Maximum 50 ingredients per receipt.' });
    }

    // ── Validate and normalise each ingredient ────────────────────────────────
    const normalised = [];
    for (let i = 0; i < ingredients.length; i++) {
      const item = ingredients[i];
      const pos = `ingredients[${i}]`;

      if (!item.ingredientId || typeof item.ingredientId !== 'string') {
        return res.status(400).json({ error: `${pos}: ingredientId is required.` });
      }
      const actualWt = parseFloat(item.actualWeight);
      if (isNaN(actualWt) || actualWt <= 0) {
        return res.status(400).json({
          error: `${pos} (${item.ingredientId}): actualWeight must be a positive number.`,
        });
      }
      const expectedWt = parseFloat(item.expectedWeight || 0);

      let variancePct = 0;
      if (expectedWt > 0) {
        variancePct = Math.round(Math.abs(((actualWt - expectedWt) / expectedWt) * 100) * 10) / 10;
      }

      normalised.push({
        ingredientId:   item.ingredientId.trim(),
        ingredientName: (item.ingredientName || item.ingredientId).trim(),
        actualWeight:   actualWt,
        expectedWeight: expectedWt,
        uom:            (item.uom || 'LBS').trim().toUpperCase(),
        variancePct,
        hasMismatch:    variancePct > VARIANCE_THRESHOLD,
      });
    }

    // ── Post single Inventory Receipt with all items in Details[] ─────────────
    const baseUrl = process.env.ACUMATICA_BASE_URL;
    let receiptPosted = false;
    let receiptNbr = null;
    let receiptError = null;

    try {
      const token = await getAccessToken();

      const details = normalised.map(item => ({
        InventoryID: { value: item.ingredientId },
        Warehouse:   { value: 'SHEPHERDS' },
        Location:    { value: 'PRODUCTION' },
        Qty:         { value: item.actualWeight },
        UOM:         { value: item.uom },
        Description: {
          value: `Receipt for ${batchId.trim()} — ${item.ingredientName}`,
        },
      }));

      const receiptPayload = {
        Type:    { value: 'Receipt' },
        Date:    { value: dateReceived },
        Hold:    { value: false },
        Details: details,
      };

      const receiptUrl = `${baseUrl}/entity/Default/23.200.001/InventoryReceipt`;

      const receiptRes = await fetch(receiptUrl, {
        method: 'PUT',
        headers: {
          Authorization:  `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept:         'application/json',
        },
        body: JSON.stringify(receiptPayload),
      });

      if (receiptRes.ok) {
        receiptPosted = true;
        try {
          const json = await receiptRes.json();
          receiptNbr = json?.ReferenceNbr?.value || null;
        } catch { /* response may not be JSON */ }
      } else {
        const text = await receiptRes.text();
        receiptError = `Acumatica returned ${receiptRes.status}: ${text}`;
        console.error('[submit-receipt] Acumatica error:', receiptError);
      }
    } catch (err) {
      receiptError = err.message;
      console.error('[submit-receipt] Acumatica request error:', err);
    }

    // ── Send mismatch alerts for any ingredient over threshold ────────────────
    const now = new Date().toISOString();
    const itemResults = await Promise.all(
      normalised.map(async item => {
        let alertSent = false;
        if (item.hasMismatch) {
          try {
            const alertResult = await sendMismatchAlert({
              runNumber:      batchId.trim(),
              productName:    productName || 'Unknown Product',
              runDate:        startDate || 'Not specified',
              ingredientName: item.ingredientName,
              expectedWeight: item.expectedWeight,
              actualWeight:   item.actualWeight,
              variancePct:    item.variancePct,
              timestamp:      now,
            });
            alertSent = alertResult?.sent === true;
          } catch (err) {
            console.error(`[submit-receipt] Alert failed for ${item.ingredientId}:`, err.message);
          }
        }
        return {
          ingredientId:   item.ingredientId,
          ingredientName: item.ingredientName,
          actualWeight:   item.actualWeight,
          expectedWeight: item.expectedWeight,
          variancePct:    item.variancePct,
          hasMismatch:    item.hasMismatch,
          alertSent,
        };
      })
    );

    // ── Build response ─────────────────────────────────────────────────────────
    const mismatchCount = itemResults.filter(i => i.hasMismatch).length;
    const response = {
      success:       true,
      receiptPosted,
      receiptNbr,
      totalItems:    normalised.length,
      mismatchCount,
      items:         itemResults,
    };

    if (receiptError) {
      response.receiptPosted = false;
      response.receiptNbr    = null;
      response.receiptError  = receiptError;
    }

    // 207 Multi-Status when receipt failed but we still processed everything
    const statusCode = receiptPosted ? 200 : 207;
    return res.status(statusCode).json(response);

  } catch (err) {
    console.error('[submit-receipt] Unhandled error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
