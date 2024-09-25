import apiClient from './apiClient';


const getAllUserAPI = () => {
    return apiClient.get("/user");
}

const getUserIdAPI = ( ({ userId }: { userId: number}) => {
    return apiClient.get(`/user/${userId}`);
})

const updateUserIdAPI = ( ({ userId }: { userId: number}, {fullName ,email, password} : {fullName :string ,email :string, password : string}) => {
    return apiClient.put(`/user/${userId}`, {fullName ,email, password});
})

const createUserAPI = (({fullName ,email, password} : {fullName :string ,email :string, password : string}) => {
    return apiClient.post("/user",{fullName ,email, password});
})
const deleteUserIdAPI = ( ({ userId }: { userId: number}) => {
    return apiClient.delete(`/user/${userId}`);
})
export default {getAllUserAPI, getUserIdAPI, updateUserIdAPI, createUserAPI, deleteUserIdAPI};
