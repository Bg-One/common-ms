import http from "../../../utils/http"

export let listAllProduceApi = (obj = {}) => {
    return http.post('produce/listAllProduce', obj)
}
export let deleteProduceApi = (obj = {}) => {
    return http.post('produce/deleteProduce', obj)
}
export let listProduceMemListApi = (obj = {}) => {
    return http.post('produce/listProduceMemList', obj)
}

export const addProduceApi = (data) => {
    return http.post('/produce/addProduce', data)
}
export const updateLockProduceToUserApi = (data) => {
    return http.post('/produce/updateLockProduceToUser', data)
}
