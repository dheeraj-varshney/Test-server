wrk.method = "POST"
wrk.body = '{"query": "query Book {  books {    id    title{ name author }  }}", "variables": {}}'
wrk.headers["Content-Type"] = "application/json"
