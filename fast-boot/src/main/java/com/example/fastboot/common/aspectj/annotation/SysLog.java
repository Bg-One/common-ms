package com.example.fastboot.common.aspectj.annotation;

import com.example.fastboot.common.aspectj.enums.BusinessType;
import com.example.fastboot.common.aspectj.enums.OperatorType;

import java.lang.annotation.*;

/**
 * @Author bo
 * @Date 2024 07 25 16 18
 **/
@Target({ElementType.PARAMETER, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface SysLog {
    /**
     * 模块
     */
    String title() default "";

    /**
     * 功能
     */
    BusinessType businessType() default BusinessType.OTHER;

    /**
     * 操作人类别
     */
    OperatorType operatorType() default OperatorType.MANAGE;

    /**
     * 是否保存请求的参数
     */
    boolean isSaveRequestData() default true;

    /**
     * 是否保存响应的参数
     */
    boolean isSaveResponseData() default true;

    /**
     * 排除指定的请求参数
     */
    String[] excludeParamNames() default {};
}
