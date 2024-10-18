package com.example.fastboot.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @Author: LiuZhaobo
 * @Date: 2021/10/17/9:52
 */
@AllArgsConstructor
@Getter
public enum DemandItemDealStateEnum {
    WAIT_CONFIRMED(1, "待确认"),//缺省是0
    CONFIRMED(2, "已确认"),
    NOPASS(3, "未通过"),
    DEV_WAIT_CONFIRMED(4, "开发待确认"),
    DEV_WAIT_FINISH(5, "开发待完成");
    private int code;
    private String name;


}
