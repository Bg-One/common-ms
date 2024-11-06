//消息状态类型
export const alertTypeEnum = {
    DEMANDCONFIRM: 1,
    WAITCHECK: 2,
    DEMANDWAITEDIT: 3,
    DEVWAITCONFIRM: 4,
    DEMANDVOID: 5,
    MANAGEWAITCONFIRM: 6,
    DEMAND_FINISH: 7,
    DEMAND_HUNG: 8,
    DEMAND_CONFIRM_NOPASS: 9,
    CHECK_NO_PASS: 10,
    WAIT_CHECK_AGAIN: 11,
    WORDER_CHECK_FAILD: 12,
    INFO_NOWORK_COUNT: 13,
    INFO_NOWORK_REMIND: 14,
    getName: (code) => {
        if (code === 1) return '需求待确认'
        if (code === 2) return '待测试'
        if (code === 3) return '需求待编制'
        if (code === 4) return '开发待确认'
        if (code === 5) return '需求作废'
        if (code === 6) return '负责人待确认'
        if (code === 7) return '需求定版'
        if (code === 8) return '需求挂起'
        if (code === 9) return '需求确认未通过'
        if (code === 10) return '测试未通过'
        if (code === 11) return '待复测'
        if (code === 12) return '工单退回'
        if (code === 13) return '未填写报单统计'
        if (code === 14) return '未填写报单提醒'
        return ''
    }
}

