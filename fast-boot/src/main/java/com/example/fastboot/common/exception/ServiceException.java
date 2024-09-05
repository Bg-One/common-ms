package com.example.fastboot.common.exception;


import com.example.fastboot.common.enums.CommonResultEnum;
import lombok.Data;

/**
 * @author liuzhaobo
 */
@Data
public class ServiceException extends RuntimeException {
    /**
     * 错误码
     */
    private int errorCode;
    /**
     * 错误信息
     */
    private String errorMsg;

    /**
     * 返回结果枚举
     */
    private CommonResultEnum commonResultEnum;



    public ServiceException() {
        super();
    }


    public ServiceException(CommonResultEnum commonResultEnum, String errorMsg) {
        this.commonResultEnum = commonResultEnum;
        this.errorMsg = errorMsg;
    }

    public ServiceException(CommonResultEnum commonResultEnum) {
        this.errorCode = commonResultEnum.getCode();
        this.errorMsg = commonResultEnum.getMessage();
        this.commonResultEnum = commonResultEnum;
    }

    public ServiceException(CommonResultEnum commonResultEnum, Throwable cause) {
        this.errorCode = commonResultEnum.getCode();
        this.errorMsg = commonResultEnum.getMessage();
    }

    public ServiceException(String errorMsg) {
        this.errorMsg = errorMsg;
    }

    public ServiceException(int errorCode, String errorMsg) {
        this.errorCode = errorCode;
        this.errorMsg = errorMsg;
    }

    public ServiceException(int errorCode, String errorMsg, Throwable cause) {
        this.errorCode = errorCode;
        this.errorMsg = errorMsg;
    }



    @Override
    public Throwable fillInStackTrace() {
        return this;
    }


}
