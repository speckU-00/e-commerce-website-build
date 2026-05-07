'use client'

import { motion } from 'framer-motion'
import { Shield, CreditCard, Clock, Headphones, Download, Award } from 'lucide-react'

const badges = [
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Protected by Razorpay',
  },
  {
    icon: Download,
    title: 'Instant Access',
    description: 'Download immediately',
  },
  {
    icon: Clock,
    title: 'Lifetime Access',
    description: 'No recurring fees',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'We are here to help',
  },
  {
    icon: CreditCard,
    title: 'Easy Refunds',
    description: '7-day money back',
  },
  {
    icon: Award,
    title: 'Quality Content',
    description: 'Expert-crafted products',
  },
]

export function TrustBadges() {
  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Why Choose Us
          </h2>
          <p className="mt-2 text-muted-foreground">
            Trusted by thousands of customers across India
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3">
                <badge.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium text-sm">{badge.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
