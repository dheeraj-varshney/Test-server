import {Agent} from "undici";
import {HttpMethod} from "undici/types/dispatcher";

const http = new Agent()

const fetchData = async (path, method: HttpMethod = 'GET') => await (await http.request({
  origin: 'http://localhost:3000',
  path,
  method
})).body.json()

const TitleResolver = async () => ({
  name: async () => {
    let res = await fetchData('/authorName')
    return res.name
  },
  author: async () => {
    let res = await fetchData('/author')
    return res.author
  }
})

export const resolvers = {
  Query: {
    books: async () => ({
      id: 1,
      title: TitleResolver
    })
  },
  Mutation: {
    books: () => {}
  }
}
