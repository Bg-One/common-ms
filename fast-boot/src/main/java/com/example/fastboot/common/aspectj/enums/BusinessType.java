package com.example.fastboot.common.aspectj.enums;


import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author liuzhaobo
 */
@AllArgsConstructor

public enum BusinessType {
    /**
     * 其它
     */
    OTHER(0, "其它"),

    /**
     * 新增
     */
    INSERT(1, "新增"),

    /**
     * 修改
     */
    UPDATE(2, "修改"),

    /**
     * 删除
     */
    DELETE(3, "删除"),

    /**
     * 授权
     */
    GRANT(4, "授权"),

    /**
     * 导出
     */
    EXPORT(5, "导出"),

    /**
     * 导入
     */
    IMPORT(6, "导入"),


    /**
     * 清空数据
     */
    CLEAN(7, "清空数据");

    @Getter
    private int code;
    @Getter
    private String name;
}
