import assert from 'assert'
import setPatternsMap, { getDocumentServers, getPathServers, getUrl, getUrlAndVariablesList, getUrlsWithVariablesListPath, getVariables, getVariablesList, setPathPattern, setPathPatternsList, setUrlWithVariables, setUrlsPathWithVariables } from '../src/parser'
import { OpenAPIv30x, OpenAPIv31x } from 'openapi-objects-types'
import * as schemas from './specs/objects'
import generator from 'random-string-builder'


const getPaths = (schema: OpenAPIv30x.OpenAPI | OpenAPIv31x.OpenAPI) => {
    if (!schema) throw new Error
    const paths = schema.paths
    if (!paths) return null
    const result: Array<string> = []
    for (const path in paths) {
        if (typeof path !== 'undefined') result.push(path)
    }
    return result
}

describe('getVariables', () => {
    context('throws an error when', () => {
        it('none parameter not provided', () => {
            // Setup
            const expected = new Error('server variable is not provided')
            // Exercise and verify
            assert.throws(() => getVariables(), expected)
        })
        it('server variable has not default field', () => {
            // Setup
            const variable: OpenAPIv30x.ServerVariable | OpenAPIv31x.OpenAPI = {
                description: 'hddhd',
                enum: ['fff']
            }
            const expected = new Error('server variable has no default value')
            // Exercise and verify
            assert.throws(() => getVariables(variable), expected)
        })
    })
    context('rereturns', () => {
        it('an array', () => {
            // Setup
            const variable: OpenAPIv30x.ServerVariable | OpenAPIv31x.OpenAPI = {
                description: 'dhdhd',
                default: 'http',
                enum: ['ws', 'wss', 'https']
            }
            const expected = true
            // Exercise
            const actual = getVariables(variable)
            // Verify
            assert.strictEqual(Array.isArray(actual), expected)
        })
        it('an array that result of concatenation of default value and enum array (if provided)', () => {
            // Setup
            const variable: OpenAPIv30x.ServerVariable | OpenAPIv31x.OpenAPI = {
                description: 'dhdhd',
                default: 'http',
                enum: ['ws', 'wss', 'https', 'tres']
            }
            const expected = ['http', 'ws', 'wss', 'https', 'tres']
            // Exercise
            const actual = getVariables(variable)
            // Verify
            assert.deepStrictEqual(actual, expected)
        })
        it('an single-item array with default value if enum has been not provided', () => {
            // Setup
            const variable: OpenAPIv30x.ServerVariable | OpenAPIv31x.OpenAPI = {
                default: 'http'
            }
            const expected = ['http']
            // Exercise
            const actual = getVariables(variable)
            // Verify
            assert.deepStrictEqual(actual, expected)
        })
    })
})

describe('getUrl', () => {
    context('throws an error when', () => {
        it('server parameter is not provided', () => {
            // Setup
            const expected = new Error('server is not provided')
            // Exercise and verify
            assert.throws(() => getUrl(), expected)
        })
        it('server parameter object has not a "url" field', () => {
            // Setup
            const server: OpenAPIv30x.Server | OpenAPIv31x.Server = {
                description: 'dld dkkd dddl',
                variables: {
                    protocol: {
                        default: 'http',
                        enum: ['ws', 'http']
                    }
                }
            }
            const expected = new Error('server does not contain url')
            // Exercise and verify
            assert.throws(() => getUrl(server), expected)
        })
    })
    context('rereturns', () => {
        it('an object', () => {
            // Setup
            const server: OpenAPIv30x.Server | OpenAPIv31x.Server = {
                url: 'http://localhost:8000',
                description: 'dld dkkd dddl',
                variables: {
                    protocol: {
                        default: 'http',
                        enum: ['ws', 'http']
                    }
                }
            }
            const expected = "object"
            // Exercise
            const actual = typeof getUrl(server)
            // Verify
            assert.strictEqual(actual, expected)
        })
        it('with "url" and "variables" fields', () => {
            // Setup
            const server: OpenAPIv30x.Server | OpenAPIv31x.Server = {
                url: 'http://localhost:8000',
                description: 'dld dkkd dddl',
                variables: {
                    protocol: {
                        default: 'http',
                        enum: ['ws', 'http']
                    }
                }
            }
            const expected = ['url', 'variables']
            // Exercise
            const actual = Object.keys(getUrl(server))
            // Verify
            assert.deepStrictEqual(actual, expected)
        })
    })
})

describe('getVariablesList', () => {
    context('throws an error when', () => {
        it('no parameter is provided', () => {
            // Setup
            const expected = new Error('variables are not provided')
            // Exercise and verify
            assert.throws(() => getVariablesList(), expected)
        })
    })
    context('rereturns', () => {
        it('an empty array if input parameter is an empty object', () => {
            // Setup
            const expected = []
            // Exercise
            const actual = getVariablesList({})
            // Verify
            assert.deepStrictEqual(actual, expected)
        })
        it('an array when the input parameter is valid', () => {
            // Setup
            const variables = {
                toto: ['j', 't', 'o'],
                caca: ['1', '2', '3']
            }
            const expected = true
            // Exercise
            const actual = Array.isArray(getVariablesList(variables))
            // Verify
            assert.strictEqual(actual, expected)
        })
        it('[{ a: "0", b: "0" }, { a: "0", b: "1" }, { a: "0", b: "2" }, { a: "1", b: "0" }, { a: "1", b: "1" }, { a: "1", b: "2" }] when the input parameter is { a: ["0", "1"], b: ["0", "1", "2"] }', () => {
            // Setup
            const variables = { 
                a: ["0", "1"], 
                b: ["0", "1", "2"] 
            }
            const expected = [{ a: "0", b: "0" }, { a: "0", b: "1" }, { a: "0", b: "2" }, { a: "1", b: "0" }, { a: "1", b: "1" }, { a: "1", b: "2" }]
            // Exercise
            const actual = getVariablesList(variables)
            // Verify
            assert.deepStrictEqual(actual, expected)
        })
    })
})

describe('getUrlAndVariablesList', () => {
    context('throws an error when', () => {
        it('the input parameter has not been provided', () => {
            // Setup
            const expected = new Error('url object is not provided')
            // Exercise and verify
            assert.throws(() => getUrlAndVariablesList(), expected)
        })
        it('the input parameter has not a "url" field', () => {
            // Setup
            const url = {}
            const expected = new Error('url object does not contain "url" field')
            // Exercise and verify
            assert.throws(() => getUrlAndVariablesList({}), expected)
        })
    })
    context('returns', () => {
        it('an object "variables" equals to an empty array  when the input parameter doesn\'t contain the "variables" field', () => {
            // Setup
            const url = {
                url: 'gff'
            }
            const expected = []
            // Exercise
            const actual = getUrlAndVariablesList(url).variables
            // Verify
            assert.deepStrictEqual(actual, expected)
        })
    })
    context('returns', () => {
        it('an object equals to { url: "url", variables: [{ a: "0", b: "0" }, { a: "0", b: "1" }, { a: "0", b: "3" }, { a: "1", b: "0" }, { a: "1", b: "1" }, { a: "1", b: "2" }] }  when the input parameter equals { url: "url", variables: { a: ["0", "1"], b: ["0", "1", "2"] } }', () => {
            // Setup
            const url = { 
                url: "url", 
                variables: { a: ["0", "1"], b: ["0", "1", "2"] } 
            }
            const expected = true
            // Exercise
            const actual = getUrlAndVariablesList(url).variables.every(variable => url.variables.a.includes(variable['a']) && url.variables.b.includes(variable['b']))
            // Verify
            assert.strictEqual(actual, expected)
        })
    })
})

describe('getDocumentServers', () => {
    context('throws an error when', () => {
        it('the input parameter is not provided', () => {
            // Setup
            const expected = new Error('schema is not provided')
            // Exercise and verify
            assert.throws(() => getDocumentServers(), expected)
        })
    })
    context('returns', () => {
        for (let i = 1; i <= 7; i++) {
            context(`with schema${i} as input`, () => {
                it('an array of of objects', () => {
                    // Setup
                    const schema = schemas[`schema${i}`]
                    const expected = true
                    // Exercise
                    const actual = Array.isArray(getDocumentServers(schema))
                    // Verify
                    assert.strictEqual(actual, expected)
                })
                it('an array of of objects that all contains a "url" field', () => {
                    // Setup
                    const schema = schemas[`schema${i}`]
                    const expected = true
                    // Exercise
                    const actual = getDocumentServers(schema).every(server => Object.keys(server).includes('url'))
                    // Verify
                    assert.strictEqual(actual, expected)
                })
            })
        }
    })
})

describe('getPathServers', () => {
    context('throws an error when', () => {
        it('the schema parameter is not not provided', () => {
            // Setup
            const schema = undefined
            const path = 'hdjd'
            const expected = new Error('schema is not provided')
            // Exercise and verify
            assert.throws(() => getPathServers(schema, path), expected)
        })
        it('the path parameter is not not provided', () => {
            // Setup
            const schema = {}
            const path = undefined
            const expected = new Error('path is not provided')
            // Exercise and verify
            assert.throws(() => getPathServers(schema, path), expected)
        })
        context('the schema contains no paths', () => {
            for (let i = 1; i <= 7; i++) {
                const paths = getPaths(schemas[`schema${i}`])
                if (!paths) {
                    it(`for given schema${i}`, () => {
                        // Setup
                        const schema = schemas[`schema${i}`]
                        const path = generator(5)
                        const expected = new Error('there is no path in schema')
                        // Exercise and verify
                        assert.throws(() => getPathServers(schema, path), expected)
                    })
                }
            }
        })
        context('the schema contains the given path', () => {
            for (let i = 1; i <= 7; i++) {
                const paths = getPaths(schemas[`schema${i}`])
                if (paths) {
                    let path: string
                    do path = generator(10)
                    while (paths.includes(path))
                    it(`for given schema${i}`, () => {
                        // Setup
                        const schema = schemas[`schema${i}`]
                        const expected = new Error('schema contains not the given path')
                        // Exercise and verify
                        assert.throws(() => getPathServers(schema, path), expected)
                    })
                }
            }
        })
    })
    context('returns', () => {
        for (let i = 1; i <= 7; i++) {
            const paths = getPaths(schemas[`schema${i}`])
            if (paths) {
                const path = paths[Math.floor(Math.random() * paths.length)]
                context(`for given schema${i}`, () => {
                    // Setup
                    const schema = schemas[`schema${i}`]
                    it('an array of of objects', () => {
                        // Setup
                        const expected = true
                        // Exercise
                        const actual = Array.isArray(getPathServers(schema, path))
                        // Verify
                        assert.strictEqual(actual, expected)
                    })
                    it('an array of of objects that all contains a "url" field', () => {
                        // Setup
                        const expected = true
                        // Exercise
                        const actual = getPathServers(schema, path).every(server => Object.keys(server).includes('url'))
                        // Verify
                        assert.strictEqual(actual, expected)
                    })
                })
            }
        }
    })
})

describe('getUrlsWithVariablesListPath', () => {
    context('throws an error when', () => {
        it('the schema parameter is not not provided', () => {
            // Setup
            const schema = undefined
            const path = 'hdjd'
            const expected = new Error('schema is not provided')
            // Exercise and verify
            assert.throws(() => getUrlsWithVariablesListPath(schema, path), expected)
        })
        it('the path parameter is not not provided', () => {
            // Setup
            const schema = {}
            const path = undefined
            const expected = new Error('path is not provided')
            // Exercise and verify
            assert.throws(() => getUrlsWithVariablesListPath(schema, path), expected)
        })
    })
    context('returns', () => {
        for (let i = 1; i <= 7; i++) {
            const paths = getPaths(schemas[`schema${i}`])
            if (paths) {
                context(`for given schema${i}`, () => {
                    // Setup
                    const schema = schemas[`schema${i}`]
                    const path = paths[Math.floor(Math.random() * paths.length)]
                    const expected = true
                    it('an array...', () => {
                        // Exercise
                        const actual = Array.isArray(getUrlsWithVariablesListPath(schema, path))
                        // Verify
                        assert.strictEqual(actual, expected)
                    })
                    it('... with "url" and "variables" fields in each item', () => {
                        // Exercise
                        const actual = getUrlsWithVariablesListPath(schema, path).every(url => {
                            const keys = Object.keys(url)
                            return keys.includes('url') && keys.includes('variables')
                        })
                        // Verify
                        assert.strictEqual(actual, expected)
                    })
                    it('... "url" being a string and "variables" being an array', () => {
                        // Exercise
                        const actual = getUrlsWithVariablesListPath(schema, path).every(url => typeof url.url === 'string' && Array.isArray(url.variables))
                        // Verify
                        assert.strictEqual(actual, expected)
                    })
                })
            }
        }
    })
})

describe('setUrlWithVariables', () => {
    context('throws an error when', () => {
        it('no argument is provided', () => {
            // Setup
            const expected = new Error('url object is not provided')
            // Exercise and verify
            assert(() => setUrlWithVariables(), expected)
        })
        it('the argument object provided has not the "url" property', () => {
            // Setup
            const url = { variables: [] }
            const expected = new Error('url object does not contain "url" field')
            // Exercise and verify
            assert(() => setUrlWithVariables(url), expected)
        })
    })
    context('returns', () => {
        it('an array of one item if variables are not provided', () => {
            // Setup
            const url = { url: 'dhdh' }
            const expected = 1
            // Exercise
            const actual = setUrlWithVariables(url).length
            // Verify
            assert.strictEqual(actual, expected)
        })
        it('an array of strings', () => {
            // Setup
            const url = { url: '/{a}/tor/{b}/var', variables: [{ a: '1', b: '2' }, { a: '3', b: '4' }] }
            const expected = [ '/1/tor/2/var', '/3/tor/4/var' ]
            // Exercise
            const actual = setUrlWithVariables(url)
            // Verify
            assert.deepStrictEqual(actual, expected)
        })
    })
})

describe('setUrlsPathWithVariables', () => {
    context('throws an error when', () => {
        it('the schema argument is not provided', () => {
            // Setup
            const schema = undefined
            const path = ''
            const expected = new Error('schema is not provided')
            // Exercise and verify
            assert.throws(() => setUrlsPathWithVariables(schema, path), expected)
        })
        it('the path argument is not provided', () => {
            // Setup
            const schema = {}
            const path = undefined
            const expected = new Error('path is not provided')
            // Exercise and verify
            assert.throws(() => setUrlsPathWithVariables(schema, path), expected)
        })
    })
    context('returns', () => {
        for (let i = 1; i <= 7; i++) {
            const paths = getPaths(schemas[`schema${i}`])
            if (paths) {
                context(`for given schema${i}`, () => {
                    // Setup
                    const schema = schemas[`schema${i}`]
                    const path = paths[Math.floor(Math.random() * paths.length)]
                    it('an array of strings', () => {
                        // Setup
                        const expected = true
                        // Exercise
                        const actual = setUrlsPathWithVariables(schema, path).every(url => typeof url)
                        // Verify
                        assert.strictEqual(actual, expected)
                    })
                })

            }
        }
    })
})

describe('setPathPattern', () => {
    it('throws an error if there is no path argument provided', () => {
        // Setup
        const expected = new Error('path is not provided')
        // Exercise and verify
        assert.throws(() => setPathPattern(), expected)
    })
    it('return /\/compagnies(?:\/([^\/#\?]+?))\/products(?:\/([^\/#\?]+?))(?:[\/#\?](?=[]|$))?(?=[\/#\?]|[]|$)/i if argument is /compagnies/{companyId}/products/{productId}', () => {
        // Setup
        const path = '/compagnies/{companyId}/products/{productId}'
        const expected = /\/compagnies(?:\/([^\/#\?]+?))\/products(?:\/([^\/#\?]+?))(?:[\/#\?](?=[]|$))?(?=[\/#\?]|[]|$)/i
        // Exercise
        const actual = setPathPattern(path)
        // Verify
        assert.deepStrictEqual(actual, expected)
    })
})

describe('setPathPatternsList', () => {
    context('throws an error when', () => {
        it('the schema argument is not provided', () => {
            // Setup
            const schema = undefined
            const path = ''
            const expected = new Error('schema is not provided')
            // Exercise and verify
            assert.throws(() => setPathPatternsList(schema, path), expected)
        })
        it('the path argument is not provided', () => {
            // Setup
            const schema = {}
            const path = undefined
            const expected = new Error('path is not provided')
            // Exercise and verify
            assert.throws(() => setPathPatternsList(schema, path), expected)
        })
    })
    context('returns', () => {
        for (let i = 1; i <= 7; i++) {
            const paths = getPaths(schemas[`schema${i}`])
            if (paths) {
                context(`for given schema${i}`, () => {
                    // Setup
                    const schema = schemas[`schema${i}`]
                    const path = paths[Math.floor(Math.random() * paths.length)]
                    it('an array of strings', () => {
                        // Setup
                        const expected = true
                        // Exercise
                        const actual = setPathPatternsList(schema, path).every(url => typeof url)
                        // Verify
                        assert.strictEqual(actual, expected)
                    })
                })

            }
        }
    })
})

describe('setPatternsMap', () => {
    context('throws an error when', () => {
        it('the schema argument is not provided', () => {
            // Setup
            const schema = undefined
            const expected = new Error('schema is not provided')
            // Exercise and verify
            assert.throws(() => setPatternsMap(schema), expected)
        })
    })
    context('returns', () => {
        for (let i = 1; i <= 7; i++) {
                context(`for given schema${i}`, () => {
                    // Setup
                    const schema = schemas[`schema${i}`]
                    it('an object...', () => {
                        // Setup
                        const expected = 'object'
                        // Exercise
                        const actual = typeof setPatternsMap(schema)
                        // Verify
                        assert.strictEqual(actual, expected)
                    })
                    it('... whose properties are objects', () => {
                        // Setup
                        const expected = true
                        // Exercise
                        const actual = Object.entries(setPatternsMap(schema)).every(item => typeof item[1] === 'object')
                        // Verify
                        assert.strictEqual(actual, expected)
                    })
                })
        }
    })
})