import http from "../../../utils/http"

export let listWorkOrderTypeApi = (obj = {}) => {
    return http.post('workOrder/listWorkOrderType', obj)
}
export let listWorkOrderCategoryApi = (obj = {}) => {
    return http.post('workOrder/listWorkOrderCategory', obj)
}
export let listWorkOrderItemApi = (obj = {}) => {
    return http.post('workOrder/listWorkOrderItem', obj)
}
export let createWorkOrderTypeApi = (obj = {}) => {
    return http.post('workOrder/createWorkOrderType', obj)
}
export let createWorkOrderCategoryApi = (obj = {}) => {
    return http.post('workOrder/createWorkOrderCategory', obj)
}
export let createWorkOrderItemApi = (obj = {}) => {
    return http.post('workOrder/createWorkOrderItem', obj)
}
export let deleteWorkOrderTypeApi = (obj = {}) => {
    return http.post('workOrder/deleteWorkOrderType', obj)
}
export let deleteWorkOrderCategoryApi = (obj = {}) => {
    return http.post('workOrder/deleteWorkOrderCategory', obj)
}
export let deleteWorkOrderItemApi = (obj = {}) => {
    return http.post('workOrder/deleteWorkOrderItem', obj)
}
export let updateWorkOrderTypeApi = (obj = {}) => {
    return http.post('workOrder/updateWorkOrderType', obj)
}
export let updateWorkOrderCategoryApi = (obj = {}) => {
    return http.post('workOrder/updateWorkOrderCategory', obj)
}
export let updateWorkOrderItemApi = (obj = {}) => {
    return http.post('workOrder/updateWorkOrderItem', obj)
}

export let listReviewRelationshipApi = (obj = {}) => {
    return http.post('workOrder/listReviewRelationship', obj)
}
export let saveReviewRelationshipApi = (obj = {}) => {
    return http.post('workOrder/saveReviewRelationship', obj)
}
export let statisticUserWorkDurationApi = (obj = {}) => {
    return http.post('workOrder/statisticUserWorkDuration', obj)
}
export let statisticProjectWorkDurationApi = (obj = {}) => {
    return http.post('workOrder/statisticProjectWorkDuration', obj)
}
