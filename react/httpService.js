import axios from 'axios';
import authService from "./authService";
import { getCookie, setCookie } from "../helpers/helpers";

class HttpService {

    constructor() {
        const instance = axios.create({
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
            baseURL: 'http://127.0.0.1:8000/api',
            // base url of api gateway
            //baseURL: 'https://small-union-backend.skiftrade.kz/api',
        });


        instance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        instance.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const originalRequest = error.config;

                // Обработка ошибок авторизации (401 Unauthorized)
                if (error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    // Получение refresh token из локального хранилища
                    const refreshToken = getCookie('refresh_token');
                    console.log('refreshToken1');
                    console.log(refreshToken);
                    if (refreshToken) {
                        console.log('refreshToken2');
                        console.log(refreshToken);
                        try {
                            // Выполните запрос на обновление токена
                            const response = await authService.refreshToken({ 'token': refreshToken });
                            console.log(response);
                            // Обновление токена и обновляющего токена в локальном хранилище
                            localStorage.setItem('token', response.data.token);
                            setCookie('refresh_token', response.data.refreshToken);

                            // Повторите оригинальный запрос с новым токеном
                            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
                            return axios(originalRequest);
                        } catch (error) {
                            // Обработайте ошибку обновления токена, если необходимо
                            throw error;
                        }
                    } else {
                        console.error('Отсутсвует refresh token в cookie');
                    }
                }
                console.error('Error:', error.message);
                // Обработка других ошибок
                return Promise.reject(error);
            }
        );

        this.instance = instance;

        const controller = new AbortController();
    }

    // Методы для выполнения запросов с использованием Axios
    get(url, project) {
        const token = localStorage.getItem('token');

        if (token) {
            this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        if (project) {
            this.instance.defaults.headers.common['Project'] = `${project}`;
        }

        return this.instance.get(url);
    }

    post(url, data, project) {
        const token = localStorage.getItem('token');
        if (token) {
            this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        if (project) {
            this.instance.defaults.headers.common['Project'] = `${project}`;
        }

        return this.instance.post(url, data);
    }

    put(url, data, project) {
        const token = localStorage.getItem('token');
        if (token) {
            this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        if (project) {
            this.instance.defaults.headers.common['Project'] = `${project}`;
        }

        return this.instance.put(url, data);
    }

    delete(url) {
        const token = localStorage.getItem('token');
        if (token) {
            this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        return this.instance.delete(url);
    }

    async logout() {
        const refreshToken = getCookie('refresh_token');
        console.log('refreshToken', refreshToken);
        if (refreshToken) {
            try {
                // Создаем новый экземпляр Axios только для разлогинивания
                const logoutInstance = axios.create({
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Authorization': `Bearer ${refreshToken}`,
                    },
                    baseURL: 'https://small-union-backend.skiftrade.kz/api',
                    //baseURL: 'http://127.0.0.1:8000/api',

                });
                const response = await logoutInstance.get('/logout');

                return response.data;
            } catch (error) {
                throw error;
            }
        } else {
            console.error('Отсутсвует refresh token в cookie');
        }
    }

    _cancelToken() {
        if (this.controller) {
            this.controller.abort('cancel prev request');
        }
    }


}
export default new HttpService();
