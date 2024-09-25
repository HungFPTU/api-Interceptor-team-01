// api/apiClient.tsx
import axios,{AxiosResponse} from 'axios';
import { Post } from '../model/RouteConfig'; // adjust the path as needed

const API_BASE_URL = "https://66f39cb871c84d805879453f.mockapi.io";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



export const getPosts = async (): Promise<Post[]> => {
    try {
      const response: AxiosResponse<Post[]> = await apiClient.get("/post");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch posts", error);
      throw error; // Re-throw error to handle it where the function is called
    }
  };


// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

export default apiClient;