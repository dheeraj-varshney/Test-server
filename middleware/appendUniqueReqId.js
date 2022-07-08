"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendUniqueReqId = void 0;
const uuid_1 = require("uuid");
const appendUniqueReqId = (req, res, next) => {
    if (!req.headers['req-id'])
        req.headers['req-id'] = (0, uuid_1.v4)();
    return next();
};
exports.appendUniqueReqId = appendUniqueReqId;
//# sourceMappingURL=appendUniqueReqId.js.map