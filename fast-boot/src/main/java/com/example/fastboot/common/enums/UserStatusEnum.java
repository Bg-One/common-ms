package com.example.fastboot.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;


/**
 * @author liuzhaobo
 */

@AllArgsConstructor
@Getter
public enum UserStatusEnum {
    DISABLE("0", "停用"),
    OK("1", "正常"),

    DELETED("2", "删除");

    private final String code;
    private final String info;

}
