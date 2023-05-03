import fs from 'fs'
import path from 'path'
import yaml from 'yaml'
import { OpenAPIv30x, OpenAPIv31x } from 'openapi-objects-types'
import patternsMap from './parser'

// ---------- Get specification input and build schema ----------

const SpecificationNotProvided = new Error('specification object or file (json, yaml or yaml) is not provided')
const SpecificationFormatNotValid = new Error('specification must be an object or a path to a specification file')
const SpecificationFileNotValid = new Error('specification file must be a json, yaml or yaml file')
const DirnameNotProvided = new Error('dirname string is not provided')
const DirnameNotValid = new Error('dirname must be a string')

/**
 * Function that gets an input, parse it and build schema
 * @param spec Specification as an object or path to a specification file
 * @param dirname It must be 'dirname' and mandatory if spec is a path file
 * @returns OpenAPI schema object
 */
export const specBuilder = async (spec: OpenAPIv30x.OpenAPI | OpenAPIv31x.OpenAPI | string, dirname?: string) => {
    if (!spec) throw SpecificationNotProvided
    let schema: OpenAPIv31x.OpenAPI | OpenAPIv30x.OpenAPI
    if (!['string', 'object'].includes(typeof spec)) throw SpecificationFormatNotValid
    else if (typeof spec === 'object') schema = spec
    else {
        if (!dirname) throw DirnameNotProvided
        if (typeof dirname !== 'string') throw DirnameNotValid
        const filePath = path.resolve(dirname, spec)
        const data = await fs.promises.readFile(filePath, 'utf8')
        const ext = path.extname(filePath).toLowerCase()
        if (['.yaml', '.yml'].includes(ext)) schema = yaml.parse(data)
        else if (ext === '.json') schema = JSON.parse(data)
        else throw SpecificationFileNotValid
    }
    return schema
}

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
export const pathRetriever = (schema: OpenAPIv30x.OpenAPI | OpenAPIv31x.OpenAPI, url: string) => {
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