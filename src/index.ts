// @ts-ignore
import parse_str from 'locutus/php/strings/parse_str'
// @ts-ignore
import http_build_query from 'locutus/php/url/http_build_query'

function fix_parse(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    if (obj === '') return null
    return obj
  }

  if (Array.isArray(obj)) return obj.map(fix_parse)

  const isArrayLike = Object.keys(obj).every((key) => {
    const n = +key
    return !isNaN(n) && n >= 0 && n < 2 ** 32
  })

  const indexes = isArrayLike ? Object.keys(obj).sort((a, b) => +a - +b) : null

  if (!indexes || indexes.some((key, i) => +key !== i))
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, fix_parse(v)])
    )

  return indexes.map((key) => fix_parse(obj[key]))
}

export function parse(str: string): any {
  const obj = {}
  parse_str(str, obj)
  return fix_parse(obj)
}

function fix_stringify(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    if (obj === null) return ''
    return obj
  }

  if (Array.isArray(obj)) return obj.map(fix_stringify)

  return Object.fromEntries(
    Object.entries(obj)
      .map(([k, v]) => v !== undefined && [k, fix_stringify(v)])
      .filter(Boolean) as any[]
  )
}

export function stringify(obj: any): string {
  return http_build_query(fix_stringify(obj), '', '&', 'PHP_QUERY_RFC3986')
}
