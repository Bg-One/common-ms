package com.example.fastboot.common.enums;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

/**
 * @Author: LiuZhaobo
 * @Date: 2021/10/17/9:52
 */
@Getter
@AllArgsConstructor
public enum DemandTraceDealStateEnum {
    NEW_ADD(1, "新增"),//缺省是0
    WORKING(2, "进行中"),
    HUNG_UP(3, "挂起"),
    FINISHED(4, "已完结"),
    REPEAL(5, "作废"),
    POSTPONE(6, "暂缓");
    private int code;
    private String name;
}
