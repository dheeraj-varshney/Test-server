"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mySchema = exports.Schema = exports.TypeDefinition = exports.ROOT_SCHEMA_PATH = void 0;
const load_files_1 = require("@graphql-tools/load-files");
const schema_1 = require("@graphql-tools/schema");
const path = require("path");
const resolvers_1 = require("./resolvers");
const merge_graphql_schemas_1 = require("merge-graphql-schemas");
/*
 * The path for the schema files
 * @type {string}
 */
exports.ROOT_SCHEMA_PATH = path.resolve(__dirname, './schemas');
/**
 * Load definitions
 */
exports.TypeDefinition = (0, merge_graphql_schemas_1.mergeTypes)((0, load_files_1.loadFilesSync)(exports.ROOT_SCHEMA_PATH));
/**
 * The deserialized version of the Graphql schema
 */
const Schema = () => (0, schema_1.makeExecutableSchema)({
    typeDefs: [exports.TypeDefinition],
    resolvers: resolvers_1.resolvers
});
exports.Schema = Schema;
exports.mySchema = (0, exports.Schema)();
//# sourceMappingURL=schema-loader.js.map