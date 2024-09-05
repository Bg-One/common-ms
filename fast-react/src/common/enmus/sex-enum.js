export const sexEnum = {
    W: 0, //女
    M: 1, //男
    getName: (code) => {
        if (code === 0) return '女'
        if (code === 1) return '男'
        return ''
    }
}
