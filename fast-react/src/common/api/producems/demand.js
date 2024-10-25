import http from "../../../utils/http"

export let countDemandApi = (obj = {}) => {
    return http.post('demand/countStatusDemand', obj)
}
export let listDemandApi = (obj = {}) => {
    return http.post('demand/listDemand', obj)
}

export let getDemandApi = (obj = {}) => {
    return http.post('demand/getDemand', obj)
}
export let addDemandApi = (obj = {}) => {
    return http.post('demand/addDemand', obj)
}
export let deleteDemandApi = (obj = {}) => {
    return http.post('demand/deleteDemand', obj)
}
export let statusTransferApi = (obj = {}) => {
    return http.post('demand/statusTransfer', obj)
}
export let updateDemandApi = (obj = {}) => {
    return http.post('demand/updateDemand', obj)
}
export let listDemandChangeRecordApi = (obj = {}) => {
    return http.post('demand/listDemandChangeRecord', obj)
}
export let deleteDemandTermApi = (obj = {}) => {
    return http.post('demand/deleteDemandTerm', obj)
}
export let listDemandTermApi = (obj = {}) => {
    return http.post('demand/listDemandTerm', obj)
}
export let countDemandConfirmApi = (obj = {}) => {
    return http.post('demandConfirm/countDemandConfirm', obj)
}
export let addOrEditDemandTermApi = (obj = {}) => {
    return http.post('demand/addOrEditDemandTerm', obj)
}

export let deleteIssuesToBeConfirmedApi = (obj = {}) => {
    return http.post('demand/deleteIssuesToBeConfirmed', obj)
}
export let listIssuesToBeConfirmedApi = (obj = {}) => {
    return http.post('demand/listIssuesToBeConfirmed', obj)
}
export let addOrEditIssuesToConfirmApi = (obj = {}) => {
    return http.post('demand/addOrEditIssuesToConfirm', obj)
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
export let getNodesApi = (obj = {}) => {
    return http.post('demandItem/getNodes', obj)
}

export let countDemandTraceByProduceApi = (obj = {}) => {
    return http.post('demandTrace/countDemandTraceByProduce', obj)
}
export let relatedProduceApi = (obj = {}) => {
    return http.post('demandTrace/relatedProduce', obj)
}

export let deleteteDemandTraceApi = (obj = {}) => {
    return http.post('demandTrace/deleteteDemandTrace', obj)
}
export let listDemandTraceApi = (obj = {}) => {
    return http.post('demandTrace/listDemandTrace', obj)
}
export let editdemandTraceApi = (obj = {}) => {
    return http.post('demandTrace/editDemandTrace', obj)
}
export const updateDemandTraceDetailDesApi = (data) => {
    return http.post('demandTrace/updateDemandTraceDetailDes', data)
}
export const addDemandTraceApi = (data) => {
    return http.post('demandTrace/addDemandTrace', data)
}
