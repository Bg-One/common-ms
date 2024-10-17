import http from "../../../utils/http"

export let listDemandConfirmApi = (obj = {}) => {
    return http.post('demandConfirm/listDemandConfirm', obj)
}

export let listDemandConfirmDetailApi = (obj = {}) => {
    return http.post('demandConfirm/listDemandConfirmDetail', obj)
}
export let updateDemandConfirmDetailApi = (obj = {}) => {
    return http.post('demandConfirm/updateDemandConfirmDetail', obj)
}
