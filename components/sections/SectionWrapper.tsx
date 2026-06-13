'use client'

import { motion } from 'framer-motion'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface SectionWrapperProps {
  id: string
  question: string
  title: string
  description: string
  children: React.ReactNode
  className?: string
}

export default function SectionWrapper({
  id,
  question,
  title,
  description,
  children,
  className,
}: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      className={cn('scroll-mt-16 py-10', className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Question label */}
      <div className="pl-4 border-l-2 border-[rgba(255,103,31,0.2)] mb-4">
        <p className="section-question">
          {question}
        </p>
      </div>

      {/* Title */}
      <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
        {title}
      </h2>

      {/* Description */}
      <p className="text-sm text-[#9a9491] mb-5 max-w-2xl leading-relaxed">
        {description}
      </p>

      <Separator className="mb-7" />

      {children}
    </motion.section>
  )
}
