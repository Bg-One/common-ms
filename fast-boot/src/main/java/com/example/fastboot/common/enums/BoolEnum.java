package com.example.fastboot.common.enums;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

/**
 * @Author bo
 * @Date 2024 07 27 16 41
 **/
@AllArgsConstructor

public enum BoolEnum {

    N(0, "否"),
    Y(1, "是");

    @Getter
    private int code;
    @Getter
    private String name;
}
