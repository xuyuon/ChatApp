import { axiosInstance } from './axios.js';


export const checkAuth = async () => {
    try{
        const res = await axiosInstance.get('/auth/check-auth');
        const data = res.data;
        console.log("checkAuth response data:", data);
        if (res.status === 200) {
            return data;
        } else {
            console.error("Authentication failed:", data.message);
            return null;
        }
    }catch(err){
        console.error("Error during authentication check:", err.response.data.message);
        return null;
    }
}


export const getUserName = async () => {
    try {
        const res = await axiosInstance.get('/auth/check-auth');
        const data = res.data;
        console.log("getUserName response data:", data);
        if (res.status === 200) {
            return data.username;
        } else {
            console.error("Failed to get username:", data.message);
            return null;
        }
    }catch(err){
        console.error("Error during getting username:", err.response.data.message);
        return null;
    }
}