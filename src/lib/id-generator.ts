export function idGenerator(prefix: string): string {
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `${prefix}-${randomPart}`;
}

export function generateUniqueId(prefix: string): string {
  return idGenerator(prefix);
}
