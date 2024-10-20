import axios from "axios";

interface Params {
    [key: string]: any
}

interface Response {
    code: number,
    data: any,
    message: string
}

const URL = 'http://103.82.25.144:8080';

export async function get(url: string, params: Params = {}): Promise<any> {
    const response = await axios.get(`${URL}${url}`, { params });
    const data: Response = response.data as Response;
    if (data.code === 200) {
        return data.data;
    }
    else {
        throw data.message;
    }
}