export const teamresourceEnum = {
    DEMAND_GROUP: 1,
    RD_GROUP: 2,
    TEST_GROUP: 3,
    TECHNICAL_GROUP: 4,
    PROJECT_GROUP: 5,
    getName: (code) => {
        if (code === 1) return '需求组'
        if (code === 2) return '研发组'
        if (code === 3) return '测试组'
        if (code === 4) return '生产组'
        if (code === 5) return '实施组'
        return ''
    }
}
