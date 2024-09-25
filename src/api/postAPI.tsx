import apiClient from './apiClient';

export const getAllPostAPI = () => {
  return apiClient.get(`/post`);
}

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
