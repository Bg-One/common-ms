package com.example.fastboot.common.enums;

/**
 * @Author: LiuZhaobo
 * @Date: 2021/10/17/9:52
 */
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

    MessageTypeEnum(int code, String name) {
        this.code = code;
        this.name = name;
    }

    public static String getName(int code) {
        for (MessageTypeEnum c : MessageTypeEnum.values()) {
            if (c.getCode() == code) {
                return c.name;
            }
        }
        return "";
    }

    public static MessageTypeEnum getValueByCode(int code) {
        for (MessageTypeEnum c : MessageTypeEnum.values()) {
            if (c.getCode() == code) {
                return c;
            }
        }
        return null;
    }

    public String getName() {
        return name;
    }

    public int getCode() {
        return code;
    }
}
