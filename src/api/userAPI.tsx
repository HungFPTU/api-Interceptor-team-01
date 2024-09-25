import apiClient from './apiClient';

// Add explicit types for userName and password
// const loginAPI = ({ userName, password }: { userName: string; password: string }) => {
//     return apiClient.post("/user", { userName, password });
// }
const getAllUser = () => {
    return apiClient.get("/user");
}

const getUserId = ( ({ userId }: { userId: number}) => {
    return apiClient.get(`/user/${userId}`);
})
export default {getAllUser, getUserId};
