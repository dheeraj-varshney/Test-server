import {DoneFuncWithErrOrRes} from 'fastify'
import * as http from 'http'
import {v4 as uuidV4} from 'uuid'

export const appendUniqueReqId = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: DoneFuncWithErrOrRes
) => {
  if (!req.headers['req-id']) req.headers['req-id'] = uuidV4()
  return next()
}
