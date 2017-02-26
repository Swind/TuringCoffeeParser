import request from 'superagent'

const Api = {
  listCookbook: () => {
    return request.get('/api/cookbooks').set('Accept', 'application/json')
  },
  getCookbook: (id) => {
    return request.get(`/api/cookbooks/${id}`).set('Accept', 'application/json')
  },
  saveCookbook: (id, cookbook) => {
    delete cookbook._id
    return request.put(`/api/cookbooks/${id}`)
      .send(cookbook)
      .set('Accept', 'application/json')
  },
  copyCookbook: (id) => {
    return request.post(`/api/cookbooks/${id}/copy`).set('Accept', 'application/json')
  },
  deleteCookbook: (id) => {
    return request.delete(`/api/cookbooks/${id}`).set('Accept', 'application/json')
  },
  brewCookbook: (id) => {
    return request.post('/api/barista/brew')
      .send({id})
      .set('Accept', 'application/json')
  },
  getHeater: () => {
    return request.get('/api/heater').set('Accept', 'application/json')
  },
  setTargetPoint: (temperature) => {
    return request.post('/api/heater')
      .send({temperature})
      .set('Accept', 'application/json')
  },
  newCookbook: (cookbook) => {
    return request.post('/api/cookbooks')
      .send(cookbook)
      .set('Accept', 'application/json')
  },
  startPrinter: () => {
    return request.post('/api/printer/start')
      .set('Accept', 'application/json')
  },
  stopPrinter: () => {
    return request.post('/api/printer/stop')
      .set('Accept', 'application/json')
  }
}

export default Api
