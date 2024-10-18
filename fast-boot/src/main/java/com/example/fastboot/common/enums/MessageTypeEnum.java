package com.example.fastboot.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @Author: LiuZhaobo
 * @Date: 2021/10/17/9:52
 */
@AllArgsConstructor
@Getter
public enum MessageTypeEnum {
    DEMAND_WAIT_CONFIRM(1, "需求待确认"),
    WAIT_CHECK(2, "待测试"),
    DEMAND_WAIT_DEIT(3, "需求待编制"),
    DEV_WAIT_CONFIRM(4, "开发待确认"),
    DEMADN_VOID(5, "需求作废"),
    MANAGE_WAIT_CONFIRM(6, "负责人待确认"),
    DEMAND_FINISH(7, "需求定版"),
    DEMAND_HUNG(8, "需求挂起"),
    DEMAND_CONFIRM_NOPASS(9, "需求确认未通过"),
    CHECK_NO_PASS(10, "测试未通过"),
    WAIT_CHECK_AGAIN(11, "待复测"),
    WORDER_CHECK_FAILD(12, "工单退回");

    private int code;
    private String name;


}
