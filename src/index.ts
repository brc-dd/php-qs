// @ts-ignore
import parse_str from 'locutus/php/strings/parse_str'
// @ts-ignore
import http_build_query from 'locutus/php/url/http_build_query'

function objectToArray(obj: any): any {
  if (typeof obj !== 'object' || obj === null) return obj
  if (Array.isArray(obj)) return obj.map(objectToArray)

  const isArrayLike = Object.keys(obj).every((key) => {
    const n = +key
    return !isNaN(n) && n >= 0 && n < 2 ** 32
  })

  const indexes = isArrayLike ? Object.keys(obj).sort((a, b) => +a - +b) : null

  if (!indexes || indexes.some((key, i) => +key !== i))
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, objectToArray(v)])
    )

  return indexes.map((key) => objectToArray(obj[key]))
}

export function parse(str: string): any {
  const obj = {}
  parse_str(str, obj)
  return objectToArray(obj)
}

export function stringify(obj: any): string {
  return http_build_query(obj, '', '&', 'PHP_QUERY_RFC3986')
}
