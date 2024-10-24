import http from "../../../utils/http"


export let editDocumentApi = (obj = {}) => {
    return http.post('document/editDocument', obj)
}
export let getDocumentFieldInfoApi = (obj = {}) => {
    return http.post('document/getDocumentFieldInfo', obj)
}
