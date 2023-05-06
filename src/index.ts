import { OpenAPIv30x, OpenAPIv31x } from 'openapi-objects-types'
import patternsMap from './parser'

// ---------- Retrieve a specific openapi schema path from an url string ----------

const SpecificationObjectNotProvided = new Error('specification is not provided')
const UrlNotProvided = new Error('url is not provided')
const SpecificationObjectNotValid = new Error('specification must be an object')
const UrlNotString = new Error('url must be a string')
const UrlNotValid = new Error('url must be a valid url')

const isValidHttpUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch (err) {
      return false
    }
}

const removeQueryAndFragment = (url: string): string => {
    const urlObj = new URL(url);
    urlObj.search = ''
    urlObj.hash = ''
    return urlObj.toString()
}

/**
 * Function that retrieves a path in a OpenAPI schema from a given url
 * @param schema Schema object built from specBuilder function
 * @param url Url string to process
 * @returns String path from OpenAPI schema or null if not found
 */
const pathRetriever = (schema: OpenAPIv30x.OpenAPI | OpenAPIv31x.OpenAPI, url: string) => {
    if (!schema) throw SpecificationObjectNotProvided
    if (typeof schema !== 'object') throw SpecificationObjectNotValid
    if (!url) throw UrlNotProvided
    if (typeof url !== 'string') throw UrlNotString
    if (!isValidHttpUrl(url)) throw UrlNotValid
    url = removeQueryAndFragment(url)
    let result: string | null = null
    const patterns = patternsMap(schema)
    for (const path in patterns) {
        if (!path) continue
        const regexp = patterns[path]
        if (typeof regexp !== 'undefined') {
            if (regexp.test(url)) {
                result = path
                break
            }
        }
    }
    return result
}

export = pathRetriever