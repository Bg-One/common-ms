import {useSelector} from "react-redux";


const authPermission = (userInfo, permission) => {
    const all_permission = "*:*:*";
    const permissions = userInfo.permissions
    if (permission && permission.length > 0) {
        return permissions.some(v => {
            return all_permission === v || v === permission
        })
    } else {
        return false
    }
}

const authRole = (userInfo, role) => {
    const super_admin = "admin";
    const roles = userInfo.roles
    if (role && role.length > 0) {
        return roles.some(v => {
            return super_admin === v || v === role
        })
    } else {
        return false
    }
}

// 验证用户是否具备某权限
export function hasPermi(userInfo, permission) {
    return authPermission(userInfo, permission);
}

// 验证用户是否含有指定权限，只需包含其中一个
export function hasPermiOr(userInfo, permissions) {
    return permissions.some(item => {
        return authPermission(userInfo, item)
    })
}

// 验证用户是否含有指定权限，必须全部拥有
export function hasPermiAnd(userInfo, permissions) {
    return permissions.every(item => {
        return authPermission(userInfo, item)
    })
}

// 验证用户是否具备某角色
export function hasRole(userInfo, role) {
    return authRole(userInfo, role)
}

// 验证用户是否含有指定角色，只需包含其中一个
export function hasRoleOr(userInfo, roles) {
    return roles.some(item => {
        return authRole(userInfo, item)
    })
}

// 验证用户是否含有指定角色，必须全部拥有
export function hasRoleAnd(userInfo, roles) {
    return roles.every(item => {
        return authRole(userInfo, item)
    })
}

