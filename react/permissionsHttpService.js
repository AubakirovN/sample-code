import HttpService from './httpService';

const projectId = process.env.REACT_APP_PROJECT_ID;
const permissionsHttpService = {
    get: async () => {
        try {
            return await HttpService.get(`/permissions`);
        } catch (error) {
            throw error;
        }
    },
    create: async (data) => {
        try {
            return await HttpService.post(`/permissions`, data);
        } catch (error) {
            throw error;
        }
    },
    edit: async(uid, data) => {
        try {
            return await HttpService.put(`/permissions/${uid}`, data);
        } catch (error) {
            throw error;
        }
    },
    delete: async (uid) => {
        try {
            return HttpService.delete(`/permissions/${uid}`);
        } catch (error) {
            throw error;
        }
    }
}

export default permissionsHttpService;
