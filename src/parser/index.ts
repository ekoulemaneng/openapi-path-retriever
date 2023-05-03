import { pathToRegexp } from 'path-to-regexp'
import { GetDocumentServers, GetPathServers, GetUrl, GetUrlAndVariablesList, GetUrlsWithVariablesListPath, GetVariables, GetVariablesList, SetPathPattern, SetPathPatternsList, SetPatternsMap, SetUrlWithVariables, SetUrlsPathWithVariables, Url, UrlAndVariablesList } from './types'
import * as errors from './errors'

export const getVariables: GetVariables = (serverVariable) => {
    if (!serverVariable) throw errors.ServerVariableNotProvided
    const variables: Array<string> = []
    const defaultVariable = serverVariable.default
    if (!defaultVariable) throw errors.NoDefaultValueForServerVariable
    variables.push(defaultVariable)
    const enumVariables = serverVariable.enum
    if (typeof enumVariables !== 'undefined') enumVariables.forEach(variable => {
        if (!variables.includes(variable)) variables.push(variable)
    })
    return variables
}

export const getUrl: GetUrl = (server) => {
    if (!server) throw errors.ServerNotProvided
    const url: Url = { url: '', variables: {} }
    const _url = server.url
    if (!_url) throw errors.ServerNotContainsUrl
    url.url = _url
    if (typeof server.variables !== 'undefined') {
        for (const name in server.variables) {
            if (typeof name !== 'undefined') {
                const variable = server.variables[name]
                if (typeof variable !== 'undefined') url.variables[name] = getVariables(variable)
            }
        }
    }
    return url
}

export const getVariablesList: GetVariablesList = (variables) => {
    if (!variables) throw errors.VariablesNotProvided
    if (Object.keys(variables).length === 0) return []
    else if (Object.keys(variables).length === 1) {
        const list: Array<Record<string, string>> = []
        const key = Object.keys(variables)[0]
        if (typeof key !== 'undefined') {
            const values = variables[key]
            if (typeof values !== 'undefined') {
                values.forEach(value => {
                    const item: Record<string, string> = {}
                    item[key] = value
                    list.push(item)
                })
            }
        }
        return list
    }
    else {
        const keys = Object.keys(variables)
        const firstKey = keys[0]
        if (!firstKey) return []
        const _variables: Record<string, Array<string>> = {}
        for (const key in variables) {
            if (!key) throw new Error
            if (key !== firstKey) {
                const v = variables[key]
                if (typeof v !== 'undefined') _variables[key] = v
            }
        }
        const list: Array<Record<string, string>> = getVariablesList(_variables)
        const result: Array<Record<string, string>> = []
        const firstValues = variables[firstKey]
        if (!firstValues) return []
        firstValues.forEach(value => {
            list.forEach(item => {
                const _item = JSON.parse(JSON.stringify(item))
                _item[firstKey] = value
                result.push(_item)
            })
        })
        return result
    }
}

export const getUrlAndVariablesList: GetUrlAndVariablesList = (_url) => {
    if (!_url) throw errors.UrlObjectNotProvided
    const url = _url.url
    if (!url) throw errors.UrlObjectNotContainsUrlField
    const _variables = _url.variables ?? {}
    const variables = getVariablesList(_variables)
    if (!variables) throw new Error
    return { url, variables }
}

export const getDocumentServers: GetDocumentServers = (schema) => {
    if (!schema) throw errors.SchemaNotProvided
    const servers = schema.servers
    if (!servers) return []
    return servers
}

export const getPathServers: GetPathServers = (schema, path) => {
    if (!schema) throw errors.SchemaNotProvided
    if (!path) throw errors.PathNotProvided
    const documentServeurs = getDocumentServers(schema) ?? []
    const paths = schema.paths
    if (!paths) throw errors.NoPathsInSchema
    const pathItem = paths[path]
    if (!pathItem) throw errors.SchemaContainsNotPath
    const pathServers = pathItem.servers ?? []
    return [...documentServeurs, ...pathServers]
}

export const getUrlsWithVariablesListPath: GetUrlsWithVariablesListPath = (schema, path) => {
    if (!schema) throw errors.SchemaNotProvided
    if (!path) throw errors.PathNotProvided
    const result: Array<UrlAndVariablesList> = []
    const servers = getPathServers(schema, path) ?? []
    const urls: Array<Url> = []
    servers.forEach(server => {
        urls.push(getUrl(server))
    })
    urls.forEach(url => {
        result.push(getUrlAndVariablesList(url))
    })
    return result
}

export const setUrlWithVariables: SetUrlWithVariables = (_url) => {
    if (!_url) throw errors.UrlObjectNotProvided
    if (!_url.url) errors.UrlObjectNotContainsUrlField
    const variables = _url.variables
    if (!variables || variables.length === 0) return [_url.url]
    const urls: Array<string> = []
    variables.forEach(variable => {
        let url = _url.url
        for (const key in variable) {
            if (typeof key !== 'undefined') {
                const v = variable[key]
                if (typeof v !== 'undefined') url = url.replace(`{${key}}`, v)
            }
        }
        urls.push(url)
    })
    return urls
}

export const setUrlsPathWithVariables: SetUrlsPathWithVariables = (schema, path) => {
    if (!schema) throw errors.SchemaNotProvided
    if (!path) throw errors.PathNotProvided
    const getUrlsWithVariablesList = getUrlsWithVariablesListPath(schema, path)
    if (!getUrlsWithVariablesList) return []
    let urls: Array<string> = []
    getUrlsWithVariablesList.forEach(url => {
        urls = [ ...urls, ...setUrlWithVariables(url)]
    })
    return urls
}

export const setPathPattern: SetPathPattern = (path) => {
    if (!path) throw errors.PathNotProvided
    return pathToRegexp(path.replace(/\{(\w+)\}/g, ':$1'), undefined, { start: false, end: false })
}

export const setPathPatternsList: SetPathPatternsList = (schema, path) => {
    if (!schema) throw errors.SchemaNotProvided
    if (!path) throw errors.PathNotProvided
    let urls = setUrlsPathWithVariables(schema, path)
    return urls.map(url => new RegExp('^' + new RegExp(url).source + setPathPattern(path).source + '$'))
}

const setPatternsMap: SetPatternsMap = (schema) => {
    if (!schema) throw errors.SchemaNotProvided
    const paths = schema.paths
    if (!paths || Object.keys(paths).length === 0) return {}
    const map: Record<string, RegExp> = {}
    for (const path in paths) {
        if (typeof path !== 'undefined') {
            const patterns = setPathPatternsList(schema, path)
            patterns.forEach(pattern => {
                map[path] = pattern
            })
        }
    }
    return map
}

export default setPatternsMap