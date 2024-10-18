package com.example.fastboot.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @Author: LiuZhaobo
 * @Date: 2021/10/17/9:52
 */
@AllArgsConstructor
public enum SoftCheckEnum {
    ADD(1,"新增"),
    PASS(2,"已通过"),
    NO_PASS(3,"未通过"),
    OPEN(4,"重新打开"),
    HUNGUP(5,"挂起"),
    CLOSEE(6,"已关闭"),
    DEV_FINISH(7,"开发已完成");

    @Getter
    private  int code;
    @Getter
    private String name;

}
