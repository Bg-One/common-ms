package com.example.fastboot.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @description:
 * @author: winl
 * @time: 2023/1/16 16:12
 */
@AllArgsConstructor
@Getter
public enum TeamResourceEnum {

    DEMAND_GROUP(1,"需求组"),
    RD_GROUP(2,"研发组"),
    TEST_GROUP(3,"测试组"),
    TECHNICAL_GROUP(4,"生产组"),
    PROJECT_GROUP(5,"实施组");
    private int code;
    private String name;

}
