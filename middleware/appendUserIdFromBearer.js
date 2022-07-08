"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendUserIdFromBearer = void 0;
const jwt = require("jsonwebtoken");
const appendUserIdFromBearer = (req, res, next) => {
    try {
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            req.headers['bearer_userId'] = jwt.decode(token).userId;
        }
    }
    catch (e) { }
    return next();
};
exports.appendUserIdFromBearer = appendUserIdFromBearer;
//# sourceMappingURL=appendUserIdFromBearer.js.map