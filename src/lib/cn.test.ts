import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('flex', 'items-center')).toBe('flex items-center')
  })

  it('drops falsy branches so conditionals do not need filtering', () => {
    const isHidden = false

    expect(cn('flex', isHidden && 'hidden', undefined, 'gap-2')).toBe('flex gap-2')
  })

  it('lets a later conflicting utility win, which is what makes a className prop safe', () => {
    // Without tailwind-merge both survive and stylesheet order decides, so a
    // caller's override would silently do nothing.
    expect(cn('p-4', 'p-6')).toBe('p-6')
  })

  it('keeps utilities that only look similar', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })
})
