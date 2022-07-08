"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const undici_1 = require("undici");
const http = new undici_1.Agent();
const fetchData = async (path, method = 'GET') => await (await http.request({
    origin: 'http://localhost:3000',
    path,
    method
})).body.json();
const TitleResolver = async () => ({
    name: async () => {
        let res = await fetchData('/authorName');
        return res.name;
    },
    author: async () => {
        let res = await fetchData('/author');
        return res.author;
    }
});
exports.resolvers = {
    Query: {
        books: async () => ({
            id: 1,
            title: TitleResolver
        })
    },
    Mutation: {
        books: () => { }
    }
};
//# sourceMappingURL=resolvers.js.map