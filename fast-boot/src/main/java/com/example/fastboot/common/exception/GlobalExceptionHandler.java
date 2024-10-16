package com.example.fastboot.common.exception;


import com.example.fastboot.common.enums.CommonResultEnum;
import com.example.fastboot.common.response.CommonFun;
import com.example.fastboot.common.response.CommonResult;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * controller层异常处理器，可捕获controller层抛出的运行时和非运行异常，也可在controller层自行try catch处理
 *
 * @author hmj
 * @since 2021/9/16
 */
@ControllerAdvice
@ResponseBody
@Slf4j
public class GlobalExceptionHandler {

    /**
     * 处理运行时异常
     *
     * @param request
     * @param e
     * @return
     */
    @ExceptionHandler(RuntimeException.class)
    public Object exceptionHandler(HttpServletRequest request, Exception e) {
        CommonFun.outputException(e, log);
        return new CommonResult(CommonResultEnum.FAILED, e.getMessage());
    }

    /**
     * 处理认证异常
     *
     * @param request
     * @param e
     * @return
     */
    @ExceptionHandler(AccessDeniedException.class)
    public Object accessDeniedExceptionHandler(HttpServletRequest request, Exception e) {
        CommonFun.outputException(e, log);
        e.printStackTrace();
        return new CommonResult(CommonResultEnum.AUTH_ERROR);
    }

    /**
     * 处理 form data方式调用接口校验失败抛出的异常
     *
     * @param e
     * @return
     */
    @ExceptionHandler(BindException.class)
    public Object bindExceptionHandler(BindException e) {
        List<FieldError> fieldErrors = e.getBindingResult().getFieldErrors();
        List<String> collect = fieldErrors.stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.toList());
        CommonFun.outputException(e, log);
        return new CommonResult(CommonResultEnum.FAILED, collect);
    }

    /**
     * 处理 json 请求体调用接口校验失败抛出的异常
     *
     * @param httpServletResponse
     * @param e
     * @return
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Object methodArgumentNotValidExceptionHandler(HttpServletResponse httpServletResponse, MethodArgumentNotValidException e) {
        List<FieldError> fieldErrors = e.getBindingResult().getFieldErrors();
        List<String> collect = fieldErrors.stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.toList());
        CommonFun.outputException(e, log);
        return new CommonResult(CommonResultEnum.FAILED, collect);


    }

    /**
     * 处理单个参数校验失败抛出的异常
     *
     * @param e
     * @return
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public Object constraintViolationExceptionHandler(ConstraintViolationException e) {
        Set<ConstraintViolation<?>> constraintViolations = e.getConstraintViolations();
        List<String> collect = constraintViolations.stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.toList());
        CommonFun.outputException(e, log);
        return new CommonResult(CommonResultEnum.FAILED, collect);
    }


    /**
     * 处理自定义的业务异常
     *
     * @param req
     * @param e
     * @return
     */
    @ExceptionHandler(value = ServiceException.class)
    public CommonResult CustomExceptionHandler(HttpServletRequest req, ServiceException e) {
        CommonFun.outputException(e, log);
        if (e.getCommonResultEnum() == null) {
            return new CommonResult(CommonResultEnum.FAILED, e.getErrorMsg());
        }
        return new CommonResult(e.getCommonResultEnum(), e.getErrorMsg());
    }
}
