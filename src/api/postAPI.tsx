import apiClient from './apiClient';
import { AxiosResponse } from 'axios';
import { Post } from '../model/RouteConfig';
export const getAllPostAPI = async (): Promise<Post[]> => {
    try {
      const response: AxiosResponse<Post[]> = await apiClient.get("/post");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch posts", error);
      throw error; // Re-throw error to handle it where the function is called
    }
  };

export const getPostIdAPI = ({ postId }: { postId: number }) => {
    return apiClient.get(`/post/${postId}`);
}

export const updatePostIdAPI = ({ postId }: { postId: number }, { title, dateCreate, content, userId }: { title: string, dateCreate: number, content: string, userId: number }) => {
    return apiClient.put(`/post/${postId}`, { title, dateCreate, content, userId });
}

export const deletePostIdAPI = ({ postId }: { postId: number }) => {
    return apiClient.delete(`/post/${postId}`);
}

export const createNewPostAPI = ({ title, dateCreate, content, userId }: { title: string, dateCreate: number, content: string, userId: number }) => {
    return apiClient.post("/post/", { title, dateCreate, content, userId });
}
