import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export default axios.create({
  baseURL: BASE_URL,
})

export const axiosPrivate = (token: string) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
