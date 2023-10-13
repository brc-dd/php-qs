import { parse, stringify } from 'php-qs'

console.log(stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' }))
// => foo=bar&baz%5B0%5D=qux&baz%5B1%5D=quux&corge=

console.log(parse('foo=bar&baz%5B0%5D=qux&baz%5B1%5D=quux&corge='))
// => { foo: 'bar', baz: ['qux', 'quux'], corge: '' }
