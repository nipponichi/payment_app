import api from '../http-common'

class AuthService {
  login(email, password) {
    return api.post('/login', { email, password })
  }

  logout(accessToken) {
    return api.post('/logout', {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  }

  register(userData) {
    return api.post('/register', userData)
  }
}

export default new AuthService()