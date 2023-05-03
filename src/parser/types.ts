import { OpenAPIv30x, OpenAPIv31x } from 'openapi-objects-types'

export type Url = {
    url: string
    variables: Record<string, Array<string>>
}

export type UrlAndVariablesList = {
    url: string
    variables: Array<Record<string, string>>
}

export type GetVariables = (serverVariable: OpenAPIv30x.ServerVariable | OpenAPIv31x.ServerVariable) => Array<string>

export type GetUrl = (server: OpenAPIv30x.Server | OpenAPIv31x.Server) => Url

export type GetVariablesList = (variables: Record<string, Array<string>>) => Array<Record<string, string>>

export type GetUrlAndVariablesList = (url: Url) => UrlAndVariablesList

export type GetDocumentServers = (schema: OpenAPIv30x.OpenAPI | OpenAPIv31x.OpenAPI) => Array<OpenAPIv30x.Server | OpenAPIv31x.Server>

export type GetPathServers = (schema: OpenAPIv30x.OpenAPI | OpenAPIv31x.OpenAPI, path: string) => Array<OpenAPIv30x.Server | OpenAPIv31x.Server>

export type GetUrlsWithVariablesListPath = (schema: OpenAPIv30x.OpenAPI | OpenAPIv31x.OpenAPI, path: string) => Array<UrlAndVariablesList>

export type SetUrlWithVariables = (url: UrlAndVariablesList) => Array<string>

export type SetUrlsPathWithVariables = (schema: OpenAPIv30x.OpenAPI | OpenAPIv31x.OpenAPI, path: string) => Array<string>

export type SetPathPattern = (path: string) => RegExp

export type SetPathPatternsList = (schema: OpenAPIv30x.OpenAPI | OpenAPIv31x.OpenAPI, path: string) => Array<RegExp>

export type SetPatternsMap = (schema: OpenAPIv30x.OpenAPI | OpenAPIv31x.OpenAPI) => Record<string, RegExp>

export type SetRegexpMap = (schema: OpenAPIv30x.OpenAPI | OpenAPIv31x.OpenAPI) => Record<string, RegExp>