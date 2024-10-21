import http from "../../../utils/http"

export let uploadsApi = (obj = {}) => {
    return http.post('common/uploads', obj)
}
