/**
 * Created by hitesh.c on 18/03/19.
 */
import {DoneFuncWithErrOrRes} from 'fastify'
import * as http from 'http'
import * as jwt from 'jsonwebtoken'

export const appendUserIdFromBearer = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: DoneFuncWithErrOrRes
) => {
  try {
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1]
      req.headers['bearer_userId'] = jwt.decode(token).userId
    }
  } catch (e) {}
  return next()
}
