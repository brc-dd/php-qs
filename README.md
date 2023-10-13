# php-qs

A JS library for building and parsing query strings similar to PHP's `http_build_query` and `parse_str` functions.

## Installation

```sh
npm add php-qs
```

## Usage

```ts
import { parse, stringify } from 'php-qs'

console.log(stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: null }))
// => foo=bar&baz%5B0%5D=qux&baz%5B1%5D=quux&corge=

console.log(parse('foo=bar&baz%5B0%5D=qux&baz%5B1%5D=quux&corge='))
// => { foo: 'bar', baz: ['qux', 'quux'], corge: null }
```

## Notes

- Not battle-tested. Use at your own risk.
  - Although, the tests are taken from PHP's source code and are passing.
- Not 100% compatible with PHP functions. For example,
  - `parse` might throw errors if the input is not a valid query string.
  - `stringify` uses RFC 3986, while PHP uses RFC 1738 by default.
  - some differences are there because of what Array means in JS vs PHP.

## Credits

```txt
Copyright (c) 2007-2016 Kevin van Zonneveld (https://kvz.io)
and Contributors (https://locutus.io/authors)

MIT (https://github.com/locutusjs/locutus/blob/aa2751437a92cc1b33204b5e1252e8ef899206ad/LICENSE)
```

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/brc-dd/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/brc-dd/static/sponsors.svg'/>
  </a>
</p>
