package com.example.fastboot.common.enums;

/**
 * 返回结果常量枚举类
 *
 * @author liuzhaobo
 */
public enum CommonResultEnum {

    /**
     * 失败
     */
    FAILED(0, "failed"),
    /**
     * 成功
     */
    SUCCESS(1, "success"),


//    =========================

    /**
     * 登录用户不存在
     */
    USER_UN(1000, "登陆用户不存在"),
    /**
     * 登录用户已删除
     */
    USER_DEL(1001, "登陆用户已删除"),
    /**
     * 登录用户已经禁用
     */
    USER_DISABLE(1002, "登陆用户已经禁用"),
    /**
     * 密码不正确
     */
    PASSWORD_ERROR(1003, "密码不正确"),
    /**
     * 验证码不正确
     */
    CAPTCHA_ERROR(1004, "验证码不正确"),
    /**
     * 验证码已失效
     */
    CAPTCHA_EXPIRED(1005, "验证码已失效"),
    /**
     * 密码输入错误次数过多
     */
    PASSWORD_ERROR_COUNT_OVER(1006, "密码输入错误次数过多"),
    /**
     * 密码输入错误次数过多
     */
    PASSWORD_ERROR_COUNT_OVER_LOCK(1007, "密码输入错误次数过多，账号已被锁定"),
    /**
     * Token失效
     */
    TOKEN_EXPIRED(1008, "会话失效"),
    /**
     * 暂无权限
     */
    AUTH_ERROR(1009, "该接口用户暂无访问权限"),
    //==================
    DEPT_EXIST(2001, "单位已存在"),
    PARENT_DISABLE(2002, "父节点禁用，禁止新增"),
    BELONG_SELF_DISABLE(2003, "所属单位不允许为自己禁止删除"),
    CHILD_DISABLE(2004, "该单位下存在未禁用的单位"),
    EXIST_USER_DISABLE(2004, "该单位下存在用户禁止删除"),
    EXIST_DEPT_DISABLE(2004, "该单位下存在单位禁止删除"),

    //    =====================================
    USER_DELE_DISABLE(3001, "当前用户禁止删除"),
    ADMIN_EDIT_DISABLE(3002, "禁止操作管理员"),
    USER_EXIT_DISABLE(3002, "用户名已存在"),
    PHONE_EXIT_DISABLE(3002, "联系方式已存在"),
    EMAIL_EXIT_DISABLE(3002, "邮箱已存在"),
    //    =======================
    ROLE_EXIT_DISABLE(4001, "角色已存在"),
    ROLE_KEY_DISABLE(4002, "角色编码已存在"),
    SUPERROLE_EDIT_DISABLE(4003, "禁止修改超级船利园"),
    SUPERROLE_DELETE_DISABLE(4004, "禁止删除超级管理员"),
    ROLE_USER_EXIT_DELE_DISABLE(4005, "角色已绑定用户禁止删除"),
    //===============================
    EXIST_CHILD_DISABLE(5001, "存在子菜单禁止删除"),
    MENU_NAME_DISABLE(5002, "菜单名称已存在"),
    MENU_PARENT_DISABLE(5003, "上级菜单禁止选择自己"),
    MENU_ROLE_EXIT_DELE_DISABLE(5004, "菜单已绑定角色禁止删除"),
    MENU_USER_EXIT_DELE_DISABLE(5005, "菜单已绑定用户禁止删除"),
    //======================================
    POST_NAME_EXIT_DISABLE(5005, "岗位名已存在"),
    POST_CODE_EXIT_DISABLE(5005, "岗位编码已存在"),
    POST_ALLOCATION_DISABLE(5005, "岗位已分配禁止删除"),
    //    ========================================
    FILE_DOWNLOAD_DISABLE(7001, "资源文件非法，不允许下载。 "),
    FILENAME_LENGTH_ERROR(7002, "文件名长度异常。 "),
    FILE_SIZE_ERROR(7002, "文件大小异常。 "),
    //    =============================
    REQUEST_TOO_FREQUENT(8001, "访问过去频繁请稍后再试");
    public int code;

    public String message;

    CommonResultEnum(int code, String message) {
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

    }
