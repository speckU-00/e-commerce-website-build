'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, Layout, Music, Camera, FileText, Palette } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const categories = [
  {
    name: 'Courses',
    slug: 'Course',
    icon: BookOpen,
    description: 'Learn new skills',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    name: 'Templates',
    slug: 'Templates',
    icon: Layout,
    description: 'Ready-to-use designs',
    color: 'bg-green-500/10 text-green-600 dark:text-green-400',
  },
  {
    name: 'E-Books',
    slug: 'E-Book',
    icon: FileText,
    description: 'In-depth guides',
    color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  },
  {
    name: 'Presets',
    slug: 'Presets',
    icon: Camera,
    description: 'Photo editing magic',
    color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  },
  {
    name: 'Audio',
    slug: 'Audio',
    icon: Music,
    description: 'Royalty-free music',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  },
  {
    name: 'Graphics',
    slug: 'Graphics',
    icon: Palette,
    description: 'Design assets',
    color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  },
]

export function CategorySection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Browse by Category
          </h2>
          <p className="mt-2 text-muted-foreground">
            Find exactly what you need
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={`/products?category=${category.slug}`}>
                <Card className="group hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${category.color} mb-4 group-hover:scale-110 transition-transform`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-sm">{category.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
