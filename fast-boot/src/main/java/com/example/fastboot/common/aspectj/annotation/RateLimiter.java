package com.example.fastboot.common.aspectj.annotation;


import com.example.fastboot.common.aspectj.enums.LimitType;
import com.example.fastboot.common.constant.CacheConstants;

import java.lang.annotation.*;


/**
 * @author liuzhaobo
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RateLimiter {
    /**
     * 限流key
     */
    public String key() default CacheConstants.RATE_LIMIT_KEY;

    /**
     * 限流时间,单位秒
     */
    public int time() default 60;

    /**
     * 限流次数
     */
    public int count() default 100;

    /**
     * 限流类型
     */
    public LimitType limitType() default LimitType.DEFAULT;
}
