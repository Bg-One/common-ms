import http from "../../../utils/http"

export let listMessageAlertsApi = (obj = {}) => {
    return http.post('message/listMessageAlerts', obj)
}
export let updateMessageReadFalgApi = (obj = {}) => {
    return http.post('message/updateMessageReadFalg', obj)
}
