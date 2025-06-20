'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

// 1. Context to share tab value + setter
const TabsContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
} | undefined>(undefined)

// 2. Tabs Root
interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  onValueChange: (value: string) => void
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn('tabs', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

// 3. TabsList
export function TabsList({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('tabs-list', className)}>{children}</div>
}

// 4. TabsTrigger
interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

export function TabsTrigger({
  value: triggerValue,
  children,
  className,
  ...props
}: TabsTriggerProps) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error('TabsTrigger must be used within Tabs')

  const isActive = context.value === triggerValue

  return (
    <button
      {...props}
      onClick={() => context.onValueChange(triggerValue)}
      className={cn(
        'text-sm font-medium py-2 px-4 border-b-2 transition-colors',
        isActive
          ? 'border-gray-800 text-gray-800'
          : 'border-transparent text-gray-500 hover:text-gray-700',
        className
      )}
    >
      {children}
    </button>
  )
}

// 5. TabsContent
interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export function TabsContent({
  value,
  children,
  className,
  ...props
}: TabsContentProps) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error('TabsContent must be used within Tabs')

  return context.value === value ? (
    <div className={cn('tabs-content', className)} {...props}>
      {children}
    </div>
  ) : null
}
