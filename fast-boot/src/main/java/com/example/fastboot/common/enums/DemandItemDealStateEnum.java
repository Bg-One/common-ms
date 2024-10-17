package com.example.fastboot.common.enums;

/**
 * @Author: LiuZhaobo
 * @Date: 2021/10/17/9:52
 */
public enum DemandItemDealStateEnum {
    WAIT_CONFIRMED(1, "待确认"),//缺省是0
    CONFIRMED(2, "已确认"),
    NOPASS(3, "未通过"),
    DEV_WAIT_CONFIRMED(4, "开发待确认"),
    DEV_WAIT_FINISH(5, "开发待完成");
    private int code;
    private String name;

    DemandItemDealStateEnum(int code, String name) {
        this.code = code;
        this.name = name;
    }

    public static String getName(int code) {
        for (DemandItemDealStateEnum c : DemandItemDealStateEnum.values()) {
            if (c.getCode() == code) {
                return c.name;
            }
        }
        return "";
    }

    public static DemandItemDealStateEnum getValueByCode(int code) {
        for (DemandItemDealStateEnum c : DemandItemDealStateEnum.values()) {
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
