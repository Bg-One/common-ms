import http from "../../../utils/http"

export let countCheckFeedbackByProduceApi = (obj = {}) => {
    return http.post('softwareCheck/countCheckFeedbackByProduce', obj)
}
export let relatedProduceApi = (obj = {}) => {
    return http.post('softwareCheck/relatedProduce', obj)
}

export let listCheckFeedbackApi = (obj = {}) => {
    return http.post('softwareCheck/listCheckFeedback', obj)
}

export let addOrEditCheckfeedbackApi = (obj = {}) => {
    return http.post('softwareCheck/addOrEditCheckfeedback', obj)
}
export let addOrEditCheckChangNoteApi = (obj = {}) => {
    return http.post('softwareCheck/addOrEditCheckChangNote', obj)
}
export let deleteCheckFeedbackApi = (obj = {}) => {
    return http.post('softwareCheck/deleteCheckFeedback', obj)
}
