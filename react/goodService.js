import HttpService from "../httpService";

const GoodService = {

  async goods(project) {
    return HttpService.get(`/goods`, project);
  },

  async getById(id, project) {
    return HttpService.get(`/goods/${id}`, project)
  },

  async updateGood(id, data, project) {
    return HttpService.put(`/goods/${id}`, data, project);
  },

  async deleteGood(id) {
    return HttpService.delete(`/goods/${id}`);
  },

  async uploadGoods(data, project) {
    return HttpService.post(`/upload-goods`, data, project);
  }
};

export default GoodService;