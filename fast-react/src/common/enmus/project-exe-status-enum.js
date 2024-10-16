
export const projectExecutionStatusEnum = {
    NOEXECUTE: 0,
    EXECUTING: 1,
    PAUSE: 2,
    STOP: 3,
    FINISH: 4,
    CLOSE: 5,
    getName: (code) => {
        if (code === 0) return '未执行'
        if (code === 1) return '执行中'
        if (code === 2) return '暂停'
        if (code === 3) return '中止'
        if (code === 4) return '完结'
        if (code === 5) return '取消'
    }
}
