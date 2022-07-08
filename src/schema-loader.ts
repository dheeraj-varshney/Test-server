import {loadFilesSync} from '@graphql-tools/load-files'
import {makeExecutableSchema} from '@graphql-tools/schema'
import * as path from 'path'
import {resolvers} from './resolvers'
import {mergeTypes} from "merge-graphql-schemas";

/*
 * The path for the schema files
 * @type {string}
 */
export const ROOT_SCHEMA_PATH = path.resolve(__dirname, './schemas')

/**
 * Load definitions
 */
export const TypeDefinition = mergeTypes(loadFilesSync(ROOT_SCHEMA_PATH))

/**
 * The deserialized version of the Graphql schema
 */
export const Schema = () =>
  makeExecutableSchema({
    typeDefs: [TypeDefinition],
    resolvers: resolvers
  })
export const mySchema = Schema()
