function toCamel(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase())
}

function toSnake(key: string): string {
  return key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date)
}

export function keysToCamel<T = unknown>(input: unknown): T {
  if (Array.isArray(input)) {
    return input.map((item) => keysToCamel(item)) as T
  }
  if (isPlainObject(input)) {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(input)) {
      result[toCamel(key)] = keysToCamel(value)
    }
    return result as T
  }
  return input as T
}

export function keysToSnake<T = unknown>(input: unknown): T {
  if (Array.isArray(input)) {
    return input.map((item) => keysToSnake(item)) as T
  }
  if (isPlainObject(input)) {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(input)) {
      result[toSnake(key)] = keysToSnake(value)
    }
    return result as T
  }
  return input as T
}
