export function parseEnum<T>(value: any, enumObj: T): T[keyof T] | undefined {
  if (typeof value === 'string') {
    let foundKey = undefined
    Object.entries(enumObj).forEach((kv) => {
      const objVal = kv[1] as string
      if (objVal.toLowerCase() === value.toLowerCase()) {
        foundKey = kv[0] as T[keyof T]
        return
      }
    })
    return foundKey
  }
  return undefined;
}