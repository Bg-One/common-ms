package com.example.fastboot.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @description:
 * @author: winl
 * @time: 2023/2/7 16:21
 */
@AllArgsConstructor
@Getter
public enum DocumentStatusEnum {
    EDIT(1,"编制"),
    REVIEW(2,"待评审"),
    FINAL(3,"定版");

    private int code;
    private String name;

}
