import http from "../../../utils/http"

/**
 * 获取项目列表
 * @returns {*}
 */
export const listProjectApi = (data) => {
    return http.post('/project/listProject', data)
}
/**
 * 删除产品
 * @returns {*}
 */
export const delProjectApi = (data) => {
    return http.post('/project/delProject', data)
}

/**
 * 新增项目
 * @returns {*}
 */
export const addOrEditProjectApi = (data) => {
    return http.post('/project/addOrEditProject', data)
}
/**
 * 获取项目成员列表
 * @returns {*}
 */
export const listProjectMemListApi = (data) => {
    return http.post('/project/listProjectMemList', data)
}
