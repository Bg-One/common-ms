import http from "../../../utils/http"

export let listWeeklyReporterSetApi = (obj = {}) => {
    return http.post('weekly/listWeeklyReporterSet', obj)
}
export let addWeeklyReportApi = (obj = {}) => {
    return http.post('weekly/addWeeklyReport', obj)
}
export let updateWeeklyReportApi = (obj = {}) => {
    return http.post('weekly/updateWeeklyReport', obj)
}
export let delWeeklyReportApi = (obj = {}) => {
    return http.post('weekly/delWeeklyReport', obj)
}
export let getWeeklyReporterSetDetailApi = (obj = {}) => {
    return http.post('weekly/getWeeklyReporterSetDetail', obj)
}
export let addOrEditWeeklyReportDetailApi = (obj = {}) => {
    return http.post('weekly/addOrEditWeeklyReportDetail', obj)
}
export let delWeeklyReportDetailApi = (obj = {}) => {
    return http.post('weekly/delWeeklyReportDetail', obj)
}
