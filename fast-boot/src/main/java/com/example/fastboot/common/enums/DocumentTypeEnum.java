package com.example.fastboot.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @Author: LiuZhaobo
 * @Date: 2021/10/17/9:52
 */
@Getter
@AllArgsConstructor
public enum DocumentTypeEnum {
    DEMAND(1, "需求"),
    NO_FUNC_DEMAND(2, "非功能需求"),
    OUTLINEDESIGN(3, "概要设计"),
    DBDESIGN(4, "数据库设计"),
    INTERFACEEDESIGN(5, "接口设计");
    private int code;
    private String name;

}
