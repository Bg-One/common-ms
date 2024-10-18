import http from "../../../utils/http"

export let countDemandConfirmApi = (obj = {}) => {
    return http.post('demandConfirm/countDemandConfirm', obj)
}

export let listDemandConfirmDetailApi = (obj = {}) => {
    return http.post('demandConfirm/listDemandConfirmDetail', obj)
}
export let updateDemandConfirmDetailApi = (obj = {}) => {
    return http.post('demandConfirm/updateDemandConfirmDetail', obj)
}

export let listNodesApi = (obj = {}) => {
    return http.post('demandItem/listNodes', obj)
}
