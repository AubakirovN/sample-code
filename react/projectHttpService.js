import HttpService from './httpService';

const projectHttpService = {

    getAll: async () => {
        try {
            return await HttpService.get(`/project`);
        } catch (error) {
            throw error;
        }
    },
    getBYIds: async (ids) => {
        try {
            return await HttpService.post(`/list-projects`, {ids});
        } catch (error) {
            throw error;
        }
    },
    get: async () => {
        try {
            return await HttpService.get(`/all-projects`);
        } catch (error) {
            throw error;
        }
    },
    create: async (data) => {
        try {
            return await HttpService.post(`/project`, data);
        } catch (error) {
            throw error;
        }
    },
    edit: async(uid, data) => {
        try {
            return await HttpService.put(`/project/${uid}`, data);
        } catch (error) {
            throw error;
        }
    },
    delete: async (uid) => {
        try {
            return HttpService.delete(`/project/${uid}`);
        } catch (error) {
            throw error;
        }
    }
}

export default projectHttpService;
