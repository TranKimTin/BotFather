import axios from "axios";
import * as Toast from "../toast/toast";

interface Params {
    [key: string]: any
}

interface Response {
    code: number,
    data: any,
    message: string
}

// const URL = 'http://103.82.25.144:8080/api';
const URL = '/api';

export async function get(url: string, params: Params = {}): Promise<any> {
    const response = await axios.get(`${URL}${url}`, { params });
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
    const response = await axios.post(`${URL}${url}`, body);
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

export async function put(url: string, params: Params = {}): Promise<any> {
    const response = await axios.put(`${URL}${url}`, undefined, { params });
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
    const response = await axios.delete(`${URL}${url}`, { params });
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