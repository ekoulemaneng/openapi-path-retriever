"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaContainsNotPath = exports.NoPathsInSchema = exports.PathNotProvided = exports.SchemaNotProvided = exports.UrlObjectNotContainsUrlField = exports.UrlObjectNotProvided = exports.VariablesNotProvided = exports.ServerNotContainsUrl = exports.ServerNotProvided = exports.NoDefaultValueForServerVariable = exports.ServerVariableNotProvided = void 0;
exports.ServerVariableNotProvided = new Error('server variable is not provided');
exports.NoDefaultValueForServerVariable = new Error('server variable has no default value');
exports.ServerNotProvided = new Error('server is not provided');
exports.ServerNotContainsUrl = new Error('server does not contain url');
exports.VariablesNotProvided = new Error('variables are not provided');
exports.UrlObjectNotProvided = new Error('url object is not provided');
exports.UrlObjectNotContainsUrlField = new Error('url object does not contain "url" field');
exports.SchemaNotProvided = new Error('schema is not provided');
exports.PathNotProvided = new Error('path is not provided');
exports.NoPathsInSchema = new Error('there is no path in schema');
exports.SchemaContainsNotPath = new Error('schema contains not the given path');
