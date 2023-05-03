"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPathPatternsList = exports.setPathPattern = exports.setUrlsPathWithVariables = exports.setUrlWithVariables = exports.getUrlsWithVariablesListPath = exports.getPathServers = exports.getDocumentServers = exports.getUrlAndVariablesList = exports.getVariablesList = exports.getUrl = exports.getVariables = void 0;
const path_to_regexp_1 = require("path-to-regexp");
const errors = __importStar(require("./errors"));
const getVariables = (serverVariable) => {
    if (!serverVariable)
        throw errors.ServerVariableNotProvided;
    const variables = [];
    const defaultVariable = serverVariable.default;
    if (!defaultVariable)
        throw errors.NoDefaultValueForServerVariable;
    variables.push(defaultVariable);
    const enumVariables = serverVariable.enum;
    if (typeof enumVariables !== 'undefined')
        enumVariables.forEach(variable => {
            if (!variables.includes(variable))
                variables.push(variable);
        });
    return variables;
};
exports.getVariables = getVariables;
const getUrl = (server) => {
    if (!server)
        throw errors.ServerNotProvided;
    const url = { url: '', variables: {} };
    const _url = server.url;
    if (!_url)
        throw errors.ServerNotContainsUrl;
    url.url = _url;
    if (typeof server.variables !== 'undefined') {
        for (const name in server.variables) {
            if (typeof name !== 'undefined') {
                const variable = server.variables[name];
                if (typeof variable !== 'undefined')
                    url.variables[name] = (0, exports.getVariables)(variable);
            }
        }
    }
    return url;
};
exports.getUrl = getUrl;
const getVariablesList = (variables) => {
    if (!variables)
        throw errors.VariablesNotProvided;
    if (Object.keys(variables).length === 0)
        return [];
    else if (Object.keys(variables).length === 1) {
        const list = [];
        const key = Object.keys(variables)[0];
        if (typeof key !== 'undefined') {
            const values = variables[key];
            if (typeof values !== 'undefined') {
                values.forEach(value => {
                    const item = {};
                    item[key] = value;
                    list.push(item);
                });
            }
        }
        return list;
    }
    else {
        const keys = Object.keys(variables);
        const firstKey = keys[0];
        if (!firstKey)
            return [];
        const _variables = {};
        for (const key in variables) {
            if (!key)
                throw new Error;
            if (key !== firstKey) {
                const v = variables[key];
                if (typeof v !== 'undefined')
                    _variables[key] = v;
            }
        }
        const list = (0, exports.getVariablesList)(_variables);
        const result = [];
        const firstValues = variables[firstKey];
        if (!firstValues)
            return [];
        firstValues.forEach(value => {
            list.forEach(item => {
                const _item = JSON.parse(JSON.stringify(item));
                _item[firstKey] = value;
                result.push(_item);
            });
        });
        return result;
    }
};
exports.getVariablesList = getVariablesList;
const getUrlAndVariablesList = (_url) => {
    var _a;
    if (!_url)
        throw errors.UrlObjectNotProvided;
    const url = _url.url;
    if (!url)
        throw errors.UrlObjectNotContainsUrlField;
    const _variables = (_a = _url.variables) !== null && _a !== void 0 ? _a : {};
    const variables = (0, exports.getVariablesList)(_variables);
    if (!variables)
        throw new Error;
    return { url, variables };
};
exports.getUrlAndVariablesList = getUrlAndVariablesList;
const getDocumentServers = (schema) => {
    if (!schema)
        throw errors.SchemaNotProvided;
    const servers = schema.servers;
    if (!servers)
        return [];
    return servers;
};
exports.getDocumentServers = getDocumentServers;
const getPathServers = (schema, path) => {
    var _a, _b;
    if (!schema)
        throw errors.SchemaNotProvided;
    if (!path)
        throw errors.PathNotProvided;
    const documentServeurs = (_a = (0, exports.getDocumentServers)(schema)) !== null && _a !== void 0 ? _a : [];
    const paths = schema.paths;
    if (!paths)
        throw errors.NoPathsInSchema;
    const pathItem = paths[path];
    if (!pathItem)
        throw errors.SchemaContainsNotPath;
    const pathServers = (_b = pathItem.servers) !== null && _b !== void 0 ? _b : [];
    return [...documentServeurs, ...pathServers];
};
exports.getPathServers = getPathServers;
const getUrlsWithVariablesListPath = (schema, path) => {
    var _a;
    if (!schema)
        throw errors.SchemaNotProvided;
    if (!path)
        throw errors.PathNotProvided;
    const result = [];
    const servers = (_a = (0, exports.getPathServers)(schema, path)) !== null && _a !== void 0 ? _a : [];
    const urls = [];
    servers.forEach(server => {
        urls.push((0, exports.getUrl)(server));
    });
    urls.forEach(url => {
        result.push((0, exports.getUrlAndVariablesList)(url));
    });
    return result;
};
exports.getUrlsWithVariablesListPath = getUrlsWithVariablesListPath;
const setUrlWithVariables = (_url) => {
    if (!_url)
        throw errors.UrlObjectNotProvided;
    if (!_url.url)
        errors.UrlObjectNotContainsUrlField;
    const variables = _url.variables;
    if (!variables || variables.length === 0)
        return [_url.url];
    const urls = [];
    variables.forEach(variable => {
        let url = _url.url;
        for (const key in variable) {
            if (typeof key !== 'undefined') {
                const v = variable[key];
                if (typeof v !== 'undefined')
                    url = url.replace(`{${key}}`, v);
            }
        }
        urls.push(url);
    });
    return urls;
};
exports.setUrlWithVariables = setUrlWithVariables;
const setUrlsPathWithVariables = (schema, path) => {
    if (!schema)
        throw errors.SchemaNotProvided;
    if (!path)
        throw errors.PathNotProvided;
    const getUrlsWithVariablesList = (0, exports.getUrlsWithVariablesListPath)(schema, path);
    if (!getUrlsWithVariablesList)
        return [];
    let urls = [];
    getUrlsWithVariablesList.forEach(url => {
        urls = [...urls, ...(0, exports.setUrlWithVariables)(url)];
    });
    return urls;
};
exports.setUrlsPathWithVariables = setUrlsPathWithVariables;
const setPathPattern = (path) => {
    if (!path)
        throw errors.PathNotProvided;
    return (0, path_to_regexp_1.pathToRegexp)(path.replace(/\{(\w+)\}/g, ':$1'), undefined, { start: false, end: false });
};
exports.setPathPattern = setPathPattern;
const setPathPatternsList = (schema, path) => {
    if (!schema)
        throw errors.SchemaNotProvided;
    if (!path)
        throw errors.PathNotProvided;
    let urls = (0, exports.setUrlsPathWithVariables)(schema, path);
    return urls.map(url => new RegExp('^' + new RegExp(url).source + (0, exports.setPathPattern)(path).source + '$'));
};
exports.setPathPatternsList = setPathPatternsList;
const setPatternsMap = (schema) => {
    if (!schema)
        throw errors.SchemaNotProvided;
    const paths = schema.paths;
    if (!paths || Object.keys(paths).length === 0)
        return {};
    const map = {};
    for (const path in paths) {
        if (typeof path !== 'undefined') {
            const patterns = (0, exports.setPathPatternsList)(schema, path);
            patterns.forEach(pattern => {
                map[path] = pattern;
            });
        }
    }
    return map;
};
exports.default = setPatternsMap;
