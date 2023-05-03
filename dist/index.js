"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathRetriever = exports.specBuilder = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yaml_1 = __importDefault(require("yaml"));
const parser_1 = __importDefault(require("./parser"));
// ---------- Get specification input and build schema ----------
const SpecificationNotProvided = new Error('specification object or file (json, yaml or yaml) is not provided');
const SpecificationFormatNotValid = new Error('specification must be an object or a path to a specification file');
const SpecificationFileNotValid = new Error('specification file must be a json, yaml or yaml file');
const DirnameNotProvided = new Error('dirname string is not provided');
const DirnameNotValid = new Error('dirname must be a string');
/**
 * Function that gets an input, parse it and build schema
 * @param spec Specification as an object or path to a specification file
 * @param dirname It must be 'dirname' and mandatory if spec is a path file
 * @returns OpenAPI schema object
 */
const specBuilder = (spec, dirname) => __awaiter(void 0, void 0, void 0, function* () {
    if (!spec)
        throw SpecificationNotProvided;
    let schema;
    if (!['string', 'object'].includes(typeof spec))
        throw SpecificationFormatNotValid;
    else if (typeof spec === 'object')
        schema = spec;
    else {
        if (!dirname)
            throw DirnameNotProvided;
        if (typeof dirname !== 'string')
            throw DirnameNotValid;
        const filePath = path_1.default.resolve(dirname, spec);
        const data = yield fs_1.default.promises.readFile(filePath, 'utf8');
        const ext = path_1.default.extname(filePath).toLowerCase();
        if (['.yaml', '.yml'].includes(ext))
            schema = yaml_1.default.parse(data);
        else if (ext === '.json')
            schema = JSON.parse(data);
        else
            throw SpecificationFileNotValid;
    }
    return schema;
});
exports.specBuilder = specBuilder;
// ---------- Retrieve a specific openapi schema path from an url string ----------
const SpecificationObjectNotProvided = new Error('specification is not provided');
const UrlNotProvided = new Error('url is not provided');
const SpecificationObjectNotValid = new Error('specification must be an object');
const UrlNotString = new Error('url must be a string');
const UrlNotValid = new Error('url must be a valid url');
const isValidHttpUrl = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch (err) {
        return false;
    }
};
const removeQueryAndFragment = (url) => {
    const urlObj = new URL(url);
    urlObj.search = '';
    urlObj.hash = '';
    return urlObj.toString();
};
/**
 * Function that retrieves a path in a OpenAPI schema from a given url
 * @param schema Schema object built from specBuilder function
 * @param url Url string to process
 * @returns String path from OpenAPI schema or null if not found
 */
const pathRetriever = (schema, url) => {
    if (!schema)
        throw SpecificationObjectNotProvided;
    if (typeof schema !== 'object')
        throw SpecificationObjectNotValid;
    if (!url)
        throw UrlNotProvided;
    if (typeof url !== 'string')
        throw UrlNotString;
    if (!isValidHttpUrl(url))
        throw UrlNotValid;
    url = removeQueryAndFragment(url);
    let result = null;
    const patterns = (0, parser_1.default)(schema);
    for (const path in patterns) {
        if (!path)
            continue;
        const regexp = patterns[path];
        if (typeof regexp !== 'undefined') {
            if (regexp.test(url)) {
                result = path;
                break;
            }
        }
    }
    return result;
};
exports.pathRetriever = pathRetriever;
