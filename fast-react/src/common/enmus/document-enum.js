export const documentEnum = {
    DEMAND: 1,
    NO_FUNC_DEMAND: 2,
    OUTLINEDESIGN: 3,
    DBDESIGN: 4,
    INTERFACEEDESIGN: 5,
    getName: (code) => {
        if (code === 1) return '需求开发'
        if (code === 2) return '非功能需求'
        if (code === 3) return '概要设计'
        if (code === 4) return '数据库设计'
        if (code === 5) return '接口设计'

    }
}
