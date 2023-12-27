import HttpService from './httpService';

const modulesHttpService = {
    get: async (projectId) => {
        try {
            return await HttpService.get(`/modules/${projectId}`);
        } catch (error) {
            throw error;
        }
    },
    create: async (projectId, data) => {
        try {
            return await HttpService.post(`/modules/${projectId}`, data);
        } catch (error) {
            throw error;
        }
    },
    edit: async(projectId, uid, data) => {
        try {
            return await HttpService.put(`/modules/${projectId}/${uid}`, data);
        } catch (error) {
            throw error;
        }
    },
    delete: async (projectId, uid) => {
        try {
            return HttpService.delete(`/modules/${projectId}/${uid}`);
        } catch (error) {
            throw error;
        }
    }
}

export default modulesHttpService;
