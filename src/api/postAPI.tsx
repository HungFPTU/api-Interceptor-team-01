import apiClient from './apiClient';

const getAllPostAPI = () => {
    return apiClient.get("/post");
}
const getPostIdAPI = (({ postId }: { postId: number }) => {
    return apiClient.get(`/post/${postId}`);
})
const updatePostIdAPI = (({ postId }: { postId: number }, { title, dateCreate, content, userId, image, updateDate }: { title: string, dateCreate: number, content: string, userId: number, image: string, updateDate: string }) => {
    return apiClient.put(`/post/${postId}`, { title, dateCreate, content, userId, image, updateDate });
})
const deletetePostIdAPI = (({ postId }: { postId: number }) => {
    return apiClient.delete(`/post/${postId}`);
})
const createNewPostAPI = (({ title, dateCreate, content, userId, image, updateDate }: { title: string, dateCreate: number, content: string, userId: number, image: string, updateDate: string }) => {
    return apiClient.post(`/post/`, { title, dateCreate, content, userId, image, updateDate });
})
export default { getAllPostAPI, getPostIdAPI, updatePostIdAPI, deletetePostIdAPI, createNewPostAPI };
