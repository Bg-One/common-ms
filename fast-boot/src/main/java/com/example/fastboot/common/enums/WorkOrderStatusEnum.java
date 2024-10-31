package com.example.fastboot.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @Author bo
 * @Date 2023 11 07 16 11
 **/
@AllArgsConstructor
@Getter
public enum WorkOrderStatusEnum {
    WAIT_SUBMIT(1,"待提交"),
    WAIT_CHECHED(2,"待审核"),
    CHECHED(3,"已审核");
    private int code;
    private String name;
}
