import axios from "axios";
import * as Toast from "../toast/toast";
import Cookies from 'js-cookie';

interface Params {
    [key: string]: any
}

interface Response {
    code: number,
    data: any,
    message: string
}

// const URL = 'http://mybotmaker.com/api';
const URL = '/api';

const headers = {
    'content-type': 'application/json',
    'x-access-token': ''
};

const instance = axios.create({});

instance.interceptors.request.use(
    async config => {
        return config;
    },
    error => Promise.reject(error),
);

instance.interceptors.response.use(
    response => {
        if (response.data.code === 401) { //token sai, hết hạn => về tramg login
            Toast.showError(response.data.message);
            setTimeout(() => {
                Cookies.remove("token");
                Cookies.remove("user");
                window.location.href = '/login';
            }, 1000);
            return Promise.reject(response.data);
        }
        else if (response.data.code === 402 || response.data.code === 403) { //đăng nhập sai || không có quyền
            Toast.showError(response.data.message);
            return Promise.reject(response.data);
        } else {
            return response;
        }
    },
    async error => {
        return Promise.reject(error);
    }
);

export async function get(url: string, params: Params = {}): Promise<any> {
    headers['x-access-token'] = Cookies.get('token') || '';
    const response = await instance.get(`${URL}${url}`, { headers, params });
    const data: Response = response.data as Response;
    if (data.code === 200) {
        return data.data;
    }
    else {
        console.error('axios get error', { url, data });
        Toast.showError(data.message);
        throw data;
    }
}

export async function post(url: string, body: Params = {}): Promise<any> {
    headers['x-access-token'] = Cookies.get('token') || '';
    const response = await instance.post(`${URL}${url}`, body, { headers });
    const data: Response = response.data as Response;
    if (data.code === 200) {
        return data.data;
    }
    else {
        console.error('axios post error', { url, data });
        Toast.showError(data.message);
        throw data;
    }
}

export async function put(url: string, body: Params = {}): Promise<any> {
    headers['x-access-token'] = Cookies.get('token') || '';
    const response = await instance.put(`${URL}${url}`, body, { headers });
    const data: Response = response.data as Response;
    if (data.code === 200) {
        return data.data;
    }
    else {
        console.error('axios put error', { url, data });
        Toast.showError(data.message);
        throw data;
    }
}

export async function delete_(url: string, params: Params = {}): Promise<any> {
    headers['x-access-token'] = Cookies.get('token') || '';
    const response = await instance.delete(`${URL}${url}`, { headers, params });
    const data: Response = response.data as Response;
    if (data.code === 200) {
        return data.data;
    }
    else {
        console.error('axios delete error', { url, data });
        Toast.showError(data.message);
        throw data;
    }
}