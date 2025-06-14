import axios from 'axios';
import { data } from 'react-router-dom';

export const api = axios.create({
    baseURL: "http://localhost:5000/",
    headers: {
        "Content-Type": "application/json"
    }
})


/**********************************Api Get ********************************************************* */


export const apiLoginGet = async (url) => {
    try {
        const response = await api.get(url);
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}


export const AdminInfo = async () => {
    try {
        const response = await api.get("/admin");
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export const EmployeeInfo = async () => {
    try {
        const response = await api.get("/employee");
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}


/**********************************Api Post  ********************************************************* */

export const registerForm = async (url, data) => {
    try {
        const response = await api.post(url, data);
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}


/**********************************Api Put  ********************************************************* */
export const UpdateForm = async (url, data) => {
    try {
        const response = await api.put(url, data);
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

/**********************************Api Delete  ********************************************************* */

export const DeleteForm = async (url) => {
    try {
        const response = await api.delete(url);
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
