export const messageEnum = {
    NOREAD: 0,
    READ: 1,
    getName: (code) => {
        if (code === 0) return '未读'
        if (code === 1) return '已读'
        return ''
    }
}
