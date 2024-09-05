package com.example.fastboot.common.response;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 统一返回结果类
 *
 * @author liuzhaobo
 */
@Schema(name = "通用响应实体类")
public class BaseResult {

    @Schema(
            name = "code",
            description = "响应码",
            allowableValues = {"0", "1"},
            example = "1"
    )
    public int code;

    @Schema(
            name = "message",
            description = "响应信息",
            allowableValues = {"success", "failed"},
            example = "success"
    )
    public String message;

    @Schema(
            name = "data",
            description = "响应值",
            allowableValues = {"成功", "失败"},
            example = "成功"
    )
    public Object data;


    public BaseResult(int code, String message, Object data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public BaseResult(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

}
