import http from "../../../utils/http"

export let listMenuApi = (obj = {}) => {
    return http.post('menu/listMenu', obj)
}
export let deleteSysMenuApi = (obj = {}) => {
    return http.post('menu/deleteSysMenu', obj)
}
export let addMenuApi = (obj = {}) => {
    return http.post('menu/addMenu', obj)
}
export let editMenuApi = (obj = {}) => {
    return http.post('menu/editMenu', obj)
}
export let roleMenuTreeselectApi = (obj = {}) => {
    return http.post('menu/roleMenuTreeselect', obj)
}
