export const menuTypeEnum = {
    M: 'M',
    C: 'C',
    F: 'F',
    getName: (code) => {
        if (code === 'M') return '目录'
        if (code === 'C') return '菜单'
        if (code === 'F') return '按钮/权限'
        return ''
    }
}
