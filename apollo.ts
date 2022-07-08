// import Fastify from 'fastify'
// import fastify, {FastifyInstance} from 'fastify'
import Middie from 'middie'
import {appendUniqueReqId} from './middleware/appendUniqueReqId'
import {appendUserIdFromBearer} from './middleware/appendUserIdFromBearer'
import fastify, {FastifyRequest} from "fastify";
import {mySchema} from "./src/schema-loader";
import {http} from "./src/lib/request";
import {GraphQLError} from "graphql";
import {ApolloServer} from "apollo-server-fastify";


const isServiceMessage = (err) => err.code ? true : false
const errorResponseMapper = err => err.code

export const formatError = (error: GraphQLError) => {
    console.log("Error occurred")
    const apiError: any = error.originalError
    let genericMessage = "Something seems broken. Relax, we're on it! "
    if (!apiError) {
        return error
    }
    try {
        const errorResponse = JSON.parse(apiError.error).error
        const fullError = isServiceMessage(errorResponse)
            ? errorResponseMapper(errorResponse)
            : errorResponse
        let message = fullError.message ? fullError.message : fullError.MsgText

        if (
            message === 'Error: ETIMEDOUT' ||
            message === 'Error: ESOCKETTIMEDOUT'
        ) {
            apiError.statusCode = 500
            // response.status(500)
        }
        if (
            apiError.statusCode === null ||
            apiError.statusCode === undefined ||
            (apiError.statusCode >= 500 && apiError.statusCode <= 599)
        ) {
            message = genericMessage || message
        }
        return {
            message: message,
            error: fullError,
            path: error.path,
            status: apiError.statusCode
        }
    } catch (r) {
        if (
            apiError.message === 'Error: ETIMEDOUT' ||
            apiError.message === 'Error: ESOCKETTIMEDOUT'
        ) {
            apiError.statusCode = 500
            // response.status(500)
        }
        return {
            message:
                apiError.statusCode === 500
                    ? genericMessage
                    : apiError.message || genericMessage,
            error: [],
            path: error.path,
            status: apiError.statusCode
        }
    }
}

const app = fastify({
    logger: true
});
app.decorateRequest('queryName', 'graphql')

export interface ResolverContext extends Partial<FastifyRequest> {
    _defaultIO?: object
    _loaders?: object
    response?: object
}

const apolloServer = new ApolloServer({
    schema: mySchema,
    context: ({request, reply}) => {
        const newContext: ResolverContext = request
        newContext._defaultIO = {
            HTTP: {
                post: http.post(request, reply),
                doRequest: http.doRequest(request, reply)
            }
        }
        newContext._loaders = {}
        newContext.response = reply
        return newContext
    },
    formatError
})

app.get('/health', async function (request, reply) {
    console.log("health")
    reply.send({success: 200})
})
app.get('/defence', (_, res) => {
    res.send({status: 'Closed'})
    process.emit('SIGINT', 'SIGINT')
})


async function startServer() {
    await app.register(Middie)

    app.use(appendUniqueReqId)
    app.use(appendUserIdFromBearer)

    await apolloServer.start()
    await app.register(
        apolloServer.createHandler({
            path: '/graphql*'
        })
    )

    await app.listen(9990, '0.0.0.0')
    console.log(`🚀 Server ready at http://0.0.0.0:9990`)
}

startServer()

const ELB_IDLE_TIMEOUT = 6000 // 6 seconds
// Note: idle timeout of the ELB/ALB must be lower than the keepAliveTimeout of the Node http.Server https://shuheikagawa.com/blog/2019/04/25/keep-alive-timeout/
app.server.keepAliveTimeout = ELB_IDLE_TIMEOUT + 2000
// headersTimeout of http.Server must be greater than keepAliveTimeout https://github.com/nodejs/node/issues/27363
// @ts-ignore
app.server.headersTimeout = ELB_IDLE_TIMEOUT + 2500
