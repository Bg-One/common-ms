import http from "../../../utils/http"

export let saveFlowableApi = (obj = {}) => {
    return http.post('/flowable/definition/saveFlowable', obj)
}
export let listFlowableApi = (obj = {}) => {
    return http.post('/flowable/definition/listFlowable', obj)
}
