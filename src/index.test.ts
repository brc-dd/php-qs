import { parse, stringify } from './index.js'

describe('parse', () => {
  test('basic', () => {
    expect(parse('first=val1&second=val2&third=val3')).toStrictEqual({
      first: 'val1',
      second: 'val2',
      third: 'val3'
    })
  })

  test('string with array values', () => {
    expect(
      parse('first=abc&a[]=123&a[]=false&b[]=str&c[]=3.5&a[]=last')
    ).toStrictEqual({
      first: 'abc',
      a: ['123', 'false', 'last'],
      b: ['str'],
      c: ['3.5']
    })
  })

  test('string containing numerical array keys', () => {
    expect(parse('arr[1]=sid&arr[4]=bill')).toStrictEqual({
      arr: {
        1: 'sid',
        4: 'bill'
      }
    })
  })

  test('string containing associative keys', () => {
    expect(parse('arr[first]=sid&arr[forth]=bill')).toStrictEqual({
      arr: {
        first: 'sid',
        forth: 'bill'
      }
    })
  })

  test('string with encoded data', () => {
    expect(
      parse(
        'a=%3c%3d%3d%20%20foo+bar++%3d%3d%3e&b=%23%23%23Hello+World%23%23%23'
      )
    ).toStrictEqual({
      a: '<==  foo bar  ==>',
      b: '###Hello World###'
    })
  })

  test('string with single quotes characters', () => {
    expect(parse('firstname=Bill&surname=O%27Reilly')).toStrictEqual({
      firstname: 'Bill',
      surname: "O'Reilly"
    })
  })

  test('string with backslash characters', () => {
    expect(parse('sum=10%5c2%3d5')).toStrictEqual({
      sum: '10\\2=5'
    })
  })

  test('string with double quotes data', () => {
    expect(parse('str=A+string+with+%22quoted%22+strings')).toStrictEqual({
      str: 'A string with "quoted" strings'
    })
  })

  test('string with nulls', () => {
    expect(
      parse('str=A%20string%20with%20containing%20%00%00%00%20nulls')
    ).toStrictEqual({
      str: 'A string with containing \x00\x00\x00 nulls'
    })
  })

  test('string with 2-dim array with numeric keys', () => {
    expect(parse('arr[3][4]=sid&arr[3][6]=fred')).toStrictEqual({
      arr: {
        3: {
          4: 'sid',
          6: 'fred'
        }
      }
    })
  })

  test('string with 2-dim array with null keys', () => {
    expect(parse('arr[][]=sid&arr[][]=fred')).toStrictEqual({
      arr: [['sid'], ['fred']]
    })
  })

  test('string with 2-dim array with non-numeric keys', () => {
    expect(parse('arr[one][four]=sid&arr[three][six]=fred')).toStrictEqual({
      arr: {
        one: {
          four: 'sid'
        },
        three: {
          six: 'fred'
        }
      }
    })
  })

  test('string with 3-dim array with numeric keys', () => {
    expect(parse('arr[1][2][3]=sid&arr[1][2][6]=fred')).toStrictEqual({
      arr: {
        1: {
          2: {
            3: 'sid',
            6: 'fred'
          }
        }
      }
    })
  })

  test('string with badly formed strings', () => {
    expect(parse('arr[1=sid&arr[4][2=fred')).toStrictEqual({
      arr_1: 'sid',
      arr: {
        4: 'fred'
      }
    })

    expect(parse('arr1]=sid&arr[4]2]=fred')).toStrictEqual({
      'arr1]': 'sid',
      arr: {
        4: 'fred'
      }
    })

    expect(parse('arr[one=sid&arr[4][two=fred')).toStrictEqual({
      arr_one: 'sid',
      arr: {
        4: 'fred'
      }
    })
  })

  // not supported
  // test('string with badly formed % numbers', () => {
  //   expect(parse('first=%41&second=%a&third=%b')).toStrictEqual({
  //     first: 'A',
  //     second: '%a',
  //     third: '%b'
  //   })
  // })

  test('string with non-binary safe name', () => {
    expect(parse('arr.test[1]=sid&arr test[4][two]=fred')).toStrictEqual({
      arr_test: {
        1: 'sid',
        4: {
          two: 'fred'
        }
      }
    })
  })
})

describe('stringify', () => {
  test('basic', () => {
    expect(
      stringify({
        foo: 'bar',
        baz: 1,
        test: 'a \' " ',
        0: 'abc',
        float: 10.42,
        true: true,
        false: false
      })
        .split('&')
        .sort()
    ).toStrictEqual(
      'foo=bar&baz=1&test=a%20%27%20%22%20&0=abc&float=10.42&true=1&false=0'
        .split('&')
        .sort()
    )
  })

  test('object', () => {
    expect(
      stringify({
        0: 20,
        5: 13,
        9: {
          1: 'val1',
          3: 'val2',
          string: 'string'
        },
        name: 'homepage',
        page: 10,
        sort: {
          0: 'desc',
          admin: {
            0: 'admin1',
            admin2: {
              who: 'admin2',
              2: 'test'
            }
          }
        }
      })
        .split('&')
        .sort()
    ).toStrictEqual(
      '0=20&5=13&9%5B1%5D=val1&9%5B3%5D=val2&9%5Bstring%5D=string&name=homepage&page=10&sort%5B0%5D=desc&sort%5Badmin%5D%5B0%5D=admin1&sort%5Badmin%5D%5Badmin2%5D%5Bwho%5D=admin2&sort%5Badmin%5D%5Badmin2%5D%5B2%5D=test'
        .split('&')
        .sort()
    )
  })

  test('array', () => {
    expect(
      stringify([
        '1',
        ['a', 'b'],
        'c',
        {
          d: 'e',
          f: ['g', 'h']
        }
      ])
        .split('&')
        .sort()
    ).toStrictEqual(
      '0=1&1%5B0%5D=a&1%5B1%5D=b&2=c&3%5Bd%5D=e&3%5Bf%5D%5B0%5D=g&3%5Bf%5D%5B1%5D=h'
        .split('&')
        .sort()
    )
  })
})
