export function generateSlug(make: string, model: string, year: number): string {
  const raw = `${make} ${model} ${year}`
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')     // strip diacritics
    .replace(/[^a-z0-9\s-]/g, '')        // keep alphanumeric + spaces + hyphens
    .trim()
    .replace(/\s+/g, '-')                // spaces → hyphens
    .replace(/-+/g, '-')                 // collapse multiple hyphens
}

export function generateStockId(sequence: number): string {
  const paddedSeq = sequence.toString().padStart(3, '0')
  const year = new Date().getFullYear()
  return `KCI-${year}-${paddedSeq}`
}
