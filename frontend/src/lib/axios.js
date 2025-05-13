/*
This file contains the axios instance used for making API requests.
It sets the base URL for the API and enables sending cookies with requests.
*/

import axios from 'axios';


export const axiosInstance = axios.create({
    baseURL: 'http://localhost:5001/api',
    withCredentials: true,
})