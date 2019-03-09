import axios from 'axios'

export default async baseURL => {
  const api = axios.create({
    baseURL,
    // timeout: 1000,
    // headers: {'X-Custom-Header': 'foobar'}
  })

  const { data } = await api('/')
  console.log(data)

  return data.reduce((memo, action) => {
    return {
      ...memo,
      [action]: async () => {
        const { data } = await api(`/${action}`)
        return data
      },
    }
  }, {})
}
