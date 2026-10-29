const base = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export function apiUrl(ruta: string): string {
  return `${base}${ruta}`
}
