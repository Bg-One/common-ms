import http from "../../../utils/http"

export let listProduceApi = (obj = {}) => {
    return http.post('produce/listProduce', obj)
}

export let listAllProduceApi = (obj = {}) => {
    return http.post('produce/listAllProduce', obj)
}

export let listAppearanceAcceptApi = (obj = {}) => {
    return http.post('produce/listAppearanceAccept', obj)
}
export const appearanceAcceptApi = (data) => {
    return http.post('/produce/appearanceAccept', data)
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
export const listNotBindSoftwareCheckProduceListApi = (data) => {
    return http.post('/produce/listNotBindSoftwareCheckProduceList', data)
}
export const listNotBindDemandTraceProduceListApi = (data) => {
    return http.post('/produce/listNotBindDemandTraceProduceList', data)
}
export const listNoDemandProduceApi = (data) => {
    return http.post('/produce/listNoDemandProduce', data)
}
