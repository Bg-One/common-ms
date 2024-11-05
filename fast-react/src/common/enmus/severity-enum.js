
export const severityEnum = {
    URGENT: 0,
    NORMAL: 1,

    getName: (code) => {
        if (code === 0) return '紧急'
        if (code === 1) return '一般'
    }
}
