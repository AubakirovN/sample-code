import HttpService from './httpService';

const uploadService = {
    upload: async(formData) => {
        try{
            return await HttpService.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
        }
        catch (error) {
            throw error;
        }
    },

    createMedia: async(data, model_name, model_id, project) => {

        try{
            return await HttpService.post(`/media/${model_name}/${model_id}`, data, project);
        }
        catch(error)
        {
            throw error;
        }
    },

    getMedias: async(modelName, modelId, project) => {

        try{
            return await HttpService.get(`/medias/${modelName}/${modelId}`, project);
        }
        catch(error)
        {
            throw error;
        }
    },

    getMediasByName: async(modelName, project) => {

        try{
            return await HttpService.get(`/medias/${modelName}`, project);
        }
        catch(error)
        {
            throw error;
        }
    },

    updateToMain: async(model_name, model_id, media_type, media_uid) => {
        try{
            return await HttpService.put(`/media/${model_name}/${model_id}/${media_type}/${media_uid}`);
        }
        catch(error)
        {
            throw error;
        }
    },

    createMassImages: async(data) => {
        try{
            return await HttpService.post(`/mass-image`, data);
        }
        catch(error)
        {
            throw error;
        }
    },


    deleteMedia: async(model_name, model_id, media_uid, project) => {
        return await HttpService.delete(`/medias/${model_name}/${model_id}/${media_uid}`, project);
    }
}

export default uploadService;

