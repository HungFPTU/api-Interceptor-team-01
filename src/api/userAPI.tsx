import apiClient from './apiClient';


const getAllUserAPI = () => {
    return apiClient.get("/user");
}

const getUserIdAPI = (({ userId }: { userId: number }) => {
    return apiClient.get(`/user/${userId}`);
})

const updateUserIdAPI = (
  userId: number, 
  updatedUser: { fullName: string; email: string; password: string; createDate: string; updateDate: string }
) => {
  return apiClient.put(`/user/${userId}`, updatedUser);
};

// const updateUserIdAPI = (({ userId }: { userId: number }, { fullName, email, password, createDate, updateDate }: { fullName: string, email: string, password: string, createDate: string, updateDate: string }) => {
//     return apiClient.put(`/user/${userId}`, { fullName, email, password, createDate, updateDate });
// })

const createUserAPI = (({ fullName, email, password, createDate, updateDate }: { fullName: string, email: string, password: string, createDate: string, updateDate: string }) => {
    return apiClient.post("/user", { fullName, email, password, createDate, updateDate });
})
const deleteUserIdAPI = (({ userId }: { userId: number }) => {
    return apiClient.delete(`/user/${userId}`);
})
export default { getAllUserAPI, getUserIdAPI, updateUserIdAPI, createUserAPI, deleteUserIdAPI };
