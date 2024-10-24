export const documentStatusEnum = {
    ALL: 100,
    EDIT: 1,
    REVIEW: 2,
    FINISH: 3,
    getName: (code) => {
        if (code === 100) return '全部'
        if (code === 1) return '编制'
        if (code === 2) return '待评审'
        if (code === 3) return '定版'
    }
}
