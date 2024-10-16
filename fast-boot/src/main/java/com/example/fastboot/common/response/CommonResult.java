package com.example.fastboot.common.response;


import com.example.fastboot.common.enums.CommonResultEnum;


/**
 * http 统一响应格式
 *
 * @author liuzhaobo
 */
public class CommonResult extends BaseResult {


    public CommonResult(CommonResultEnum commonResultConstant, Object data) {
        super(commonResultConstant.getCode(), commonResultConstant.getMessage(), data);
    }

    public CommonResult(CommonResultEnum commonResultConstant, String msg) {
        super(commonResultConstant.getCode(), msg);
    }

    public CommonResult(CommonResultEnum commonResultConstant) {
        super(commonResultConstant.getCode(), commonResultConstant.getMessage());
    }

    public static CommonResult success(Object obj) {
        return new CommonResult(CommonResultEnum.SUCCESS, obj);

    }

    public static CommonResult success() {
        return new CommonResult(CommonResultEnum.SUCCESS);
    }

    public static CommonResult error() {
        return new CommonResult(CommonResultEnum.FAILED);
    }

}


