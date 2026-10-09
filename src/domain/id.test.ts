import { afterEach, describe, expect, it, vi } from 'vitest'
import { createId } from './id'

afterEach(() => vi.unstubAllGlobals())

describe('event and session identifiers', () => {
  it('uses the native UUID method when available', () => {
    const randomUUID = vi.fn(() => 'a-native-uuid')
    vi.stubGlobal('crypto', { randomUUID })
    expect(createId()).toBe('a-native-uuid')
    expect(randomUUID).toHaveBeenCalledOnce()
  })

  it('creates distinct v4 IDs when randomUUID is unavailable on HTTP LAN previews', () => {
    let seed = 0
    const getRandomValues = vi.fn((bytes: Uint8Array) => {
      bytes.set(Array.from({ length: 16 }, (_, index) => seed + index))
      seed += 16
      return bytes
    })
    vi.stubGlobal('crypto', { getRandomValues })
    const first = createId()
    const second = createId()
    expect(first).toBe('00010203-0405-4607-8809-0a0b0c0d0e0f')
    expect(second).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    expect(second).not.toBe(first)
    expect(getRandomValues).toHaveBeenCalledTimes(2)
  })
})
