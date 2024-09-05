export const opreStatusEnum = {
    SUEECSS: 1,
    ERROR: 0,
    getName: (code) => {
        if (code === 1) return '成功'
        if (code === 0) return '失败'
    }
}
