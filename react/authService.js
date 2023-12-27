import HttpService from './httpService';

const authService = {
    login: async (credentials) => {
        try {
            return await HttpService.post(`/login`, credentials);
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        try {
            return await HttpService.logout();
        } catch (error) {
            throw error;
        }
    },

    refreshToken: async (refreshToken) => {
        try {
            console.log('refreshToken');
            console.log(refreshToken);
            return await HttpService.get(`/token/${refreshToken}`);
        } catch (error) {
            throw error;
        }
    },
};

export default authService;
