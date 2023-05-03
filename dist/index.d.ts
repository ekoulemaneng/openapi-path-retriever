import { OpenAPIv30x, OpenAPIv31x } from 'openapi-objects-types';
/**
 * Function that gets an input, parse it and build schema
 * @param spec Specification as an object or path to a specification file
 * @param dirname It must be 'dirname' and mandatory if spec is a path file
 * @returns OpenAPI schema object
 */
export declare const specBuilder: (spec: OpenAPIv30x.OpenAPI | OpenAPIv31x.OpenAPI | string, dirname?: string) => Promise<import("openapi-objects-types/types/3.1.x").OpenAPI | import("openapi-objects-types/types/3.0.x").OpenAPI>;
/**
 * Function that retrieves a path in a OpenAPI schema from a given url
 * @param schema Schema object built from specBuilder function
 * @param url Url string to process
 * @returns String path from OpenAPI schema or null if not found
 */
export declare const pathRetriever: (schema: OpenAPIv30x.OpenAPI | OpenAPIv31x.OpenAPI, url: string) => string | null;
