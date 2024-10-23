export const demandTraceDealstateEnum = {
    NEW_ADD: 1,
    WORKING: 2,
    HUNG_UP: 3,
    FINISHED: 4,
    REPEAL: 5,
    POSTPONE: 6,
    getName: (code) => {
        if (code ===1) return '新增'
        if (code === 2) return '进行中'
        if (code === 3) return '挂起'
        if (code ===4) return '已完结'
        if (code === 5) return '作废'
        if (code === 6) return '暂缓'
    }
}
