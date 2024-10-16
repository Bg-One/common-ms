package com.example.fastboot.common.enums;

/**
 * @description:
 * @author: winl
 * @time: 2023/1/16 16:12
 */
public enum TeamResourceEnum {

    DEMAND_GROUP(1,"需求组"),
    RD_GROUP(2,"研发组"),
    TEST_GROUP(3,"测试组"),
    TECHNICAL_GROUP(4,"生产组"),
    PROJECT_GROUP(5,"实施组");
    private int code;
    private String name;
    TeamResourceEnum(int code, String name) {
        this.code = code;
        this.name = name;
    }
    public static String getName(int code) {
        for (TeamResourceEnum c : TeamResourceEnum.values()) {
            if (c.getCode() == code) {
                return c.name;
            }
        }
        return null;
    }
    public static int getCode(String name) {
        for (TeamResourceEnum c : TeamResourceEnum.values()) {
            if (c.getName() .equals(name) ) {
                return c.code;
            }
        }
        return -1;
    }

    public static TeamResourceEnum getValueByCode(int code) {
        for (TeamResourceEnum c : TeamResourceEnum.values()) {
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
