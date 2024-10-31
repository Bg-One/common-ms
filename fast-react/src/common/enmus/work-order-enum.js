export const workOrderEnum = {
    DRAFT: 1,
    SUBMIT: 2,
    CHECKEN: 3,
    getName: (code) => {
        if (code === 1) return '草稿'
        if (code === 2) return '已提交'
        if (code === 3) return '审核完成'
        return ''
    }
}
