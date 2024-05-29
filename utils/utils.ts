export function parseEnum<T>(value: any, enumObj: T): T[keyof T] | undefined {
  if (typeof value === 'string') {
      if (Object.values(enumObj).includes(value)) {
          return value as T[keyof T];
      }
  }
  return undefined;
}