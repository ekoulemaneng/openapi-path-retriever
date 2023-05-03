import assert from 'assert'
import { specBuilder, pathRetriever } from '../src'
import * as schemas from './specs/objects'

context('With specification as object or file path', () => {
    describe('specBuilder', () => {
        describe('throws an error when', () => {
            it('specification argument is not provided', async () => {
                // Setup
                const expected = new Error('specification object or file (json, yaml or yaml) is not provided')
                // Exercise and verify
                await assert.rejects(async () => await specBuilder(), expected)
            })
            it('specification argument is neither a string nor an object', async () => {
                // Setup
                const schema = [true, 10][Math.floor(Math.random() * 2)]
                const expected = new Error('specification must be an object or a path to a specification file')
                // Exercise and verify
                await assert.rejects(async () => await specBuilder(schema), expected)
            })
            it('dirname argument is not a string', async () => {
                // Setup
                const schema = './specs/json/openapi1.json'
                const dirname = [true, 1, {}, []][Math.floor(Math.random() * 4)]
                const expected = new Error('dirname must be a string')
                // Exercise and verify
                await assert.rejects(async () => await specBuilder(schema, dirname), expected)
            })
            it('specification argument file is not a json, yaml or yml file', async () => {
                // Setup
                const schema = './specs/bad.txt'
                const expected = new Error('specification file must be a json, yaml or yaml file')
                // Exercise and verify
                await assert.rejects(async () => await specBuilder(schema, __dirname), expected)
            })
        })
        describe('returns', () => {
            for(let i = 1; i <= 7; i++) {
                describe('an object', () => {
                    context(`for specification ${i}`, () => {
                        const dirname = __dirname
                        it('if the specification is an object', async () => {
                            // Setup
                            const schema = schemas[`schema${i}`]
                            const expected = 'object'
                            // Exercise
                            const actual = typeof await specBuilder(schema)
                            // Verify
                            assert.strictEqual(actual, expected)
                        })
                        it('if the specification is a json file', async () => {
                            // Setup
                            const schema = `./specs/json/openapi${i}.json`
                            const expected = 'object'
                            // Exercise
                            const actual = typeof await specBuilder(schema, dirname)
                            // Verify
                            assert.strictEqual(actual, expected)
                        })
                        it('if the specification is a yaml file', async () => {
                            // Setup
                            const schema = `./specs/yaml/openapi${i}.yaml`
                            const expected = 'object'
                            // Exercise
                            const actual = typeof await specBuilder(schema, dirname)
                            // Verify
                            assert.strictEqual(actual, expected)
                        })
                    })
                })
            }
        })
    })
    describe('pathRetriver', () => {
        describe('throws an error when', () => {
            it('specfification is not provided', () => {
                // Setup
                const schema = undefined
                const url = ''
                const expected = new Error('specification is not provided')
                // Exercise and verify
                assert.throws(() => pathRetriever(schema, url))
            })
            it('specfification is not an object', () => {
                // Setup
                const schema = ['', 0, false][Math.floor(Math.random() * 3)]
                const url = ''
                const expected = new Error('specification must be an object')
                // Exercise and verify
                assert.throws(() => pathRetriever(schema, url))
            })
            it('url is not provided', () => {
                // Setup
                const schema = {}
                const url = undefined
                const expected = new Error('url is not provided') 
                // Exercise and verify
                assert.throws(() => pathRetriever(schema, url))
            })
            it('url is not a string', () => {
                // Setup
                const schema = {}
                const url = [{}, 0, false][Math.floor(Math.random() * 3)]
                const expected = new Error('url must be a string')
                // Exercise and verify
                assert.throws(() => pathRetriever(schema, url))
            })
            it('url is not a valid url', () => {
                // Setup
                const schema = {}
                const url = 'dhhdh'
                const expected = new Error('url must be a valid')
                // Exercise and verify
                assert.throws(() => pathRetriever(schema, url))
            })
        })
        describe('returns', () => {
            const dirname = __dirname
            describe('null', () => {
                const url = 'http://example.com/test/dhhdhd'
                for (let i = 1; i <= 7; i++) {
                    context(`for specification #${i}`, () => {
                        it('as object', async () => {
                            // Setup
                            const schema = await specBuilder(schemas[`schema${i}`])
                            const expected = null
                            // Exercise
                            const actual = pathRetriever(schema, url)
                            // Verify
                            assert.strictEqual(actual, expected)
                        })
                        it('as json file', async () => {
                            // Setup
                            const schema = await specBuilder(`./specs/json/openapi${i}.json`, dirname)
                            const expected = null
                            // Exercise
                            const actual = pathRetriever(schema, url)
                            // Verify
                            assert.strictEqual(actual, expected)
                        })
                        it('as yaml file', async () => {
                            // Setup
                            const schema = await specBuilder(`./specs/yaml/openapi${i}.yaml`, dirname)
                            const expected = null
                            // Exercise
                            const actual = pathRetriever(schema, url)
                            // Verify
                            assert.strictEqual(actual, expected)
                        })
                    })
                }
            })
            describe('a string', () => {
                for (let i = 2; i <= 7; i++) {
                    let url = ''
                    if (i === 2) url = 'https://cal-test.adyen.com/cal/services/Fund/v6/accountHolderBalance'
                    else if (i === 3) url = 'https://cal-test.adyen.com/cal/services/Hop/v6/getOnboardingUrl'
                    else if (i === 4) url = 'https://cal-test.adyen.com/cal/services/Notification/v6/createNotificationConfiguration'
                    else if (i === 5) url = 'https://balanceplatform-api-test.adyen.com/btl/v3/transactions/djdchffdjdjrjjrk'
                    else if (i === 6) url = 'https://api.codat.io/companies/sjsjjsjs/connections/isdjidikdkkd/data/accountTransactions'
                    else if (i === 7) url = 'https://pal-test.adyen.com/pal/servlet/BinLookup/v54/get3dsAvailability'
                    context(`for specification #${i}`, () => {
                        it('as object', async () => {
                            // Setup
                            const schema = await specBuilder(schemas[`schema${i}`])
                            const expected = 'string'
                            // Exercise
                            const actual = typeof pathRetriever(schema, url)
                            // Verify
                            assert.strictEqual(actual, expected)
                        })
                        it('as json file', async () => {
                            // Setup
                            const schema = await specBuilder(`./specs/json/openapi${i}.json`, dirname)
                            const expected = 'string'
                            // Exercise
                            const actual = typeof pathRetriever(schema, url)
                            // Verify
                            assert.strictEqual(actual, expected)
                        })
                        it('as yaml file', async () => {
                            // Setup
                            const schema = await specBuilder(`./specs/yaml/openapi${i}.yaml`, dirname)
                            const expected = 'string'
                            // Exercise
                            const actual = typeof pathRetriever(schema, url)
                            // Verify
                            assert.strictEqual(actual, expected)
                        })
                    })
                }
            })
        })
    })
})