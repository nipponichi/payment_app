import api from '../http-common'

class UserService {
  get(route) {
    return api.get(route)
  }

  show(route, data) {
    return api.get(`${route}/${data}`)
  }

  set(route, data) {
    const config = {}
    
/*     if (data instanceof FormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data'
      }
    } */
    
    return api.post(route, data, config)
  }

  update(route, data, id) {
    return api.put(`${route}/${id}`, data);
  }

  delete(route, data) {
    return api.delete(route, data)
  }
}

export default new UserService()