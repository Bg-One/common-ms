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

export let editCheckfeedbackApi = (obj = {}) => {
    return http.post('softwareCheck/editCheckfeedback', obj)
}
export let addCheckfeedbackApi = (obj = {}) => {
    return http.post('softwareCheck/addCheckfeedback', obj)
}
export let addOrEditCheckChangNoteApi = (obj = {}) => {
    return http.post('softwareCheck/addOrEditCheckChangNote', obj)
}
export let deleteCheckFeedbackApi = (obj = {}) => {
    return http.post('softwareCheck/deleteCheckFeedback', obj)
}
export let getCheckChangNoteApi = (obj = {}) => {
    return http.post('softwareCheck/getCheckChangeNotes', obj)
}
