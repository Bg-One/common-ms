package com.example.fastboot.common.constant;


/**
 * @author liuzhaobo
 */
public class Constants {


    /**
     * 验证码有效期（分钟）
     */
    public static final Integer CAPTCHA_EXPIRATION = 1;

    /**
     * 令牌前缀
     */
    public static final String LOGIN_USER_KEY = "login_user_key";
    /**
     * 令牌前缀
     */
    public static final String TOKEN_PREFIX = "Bearer ";

    /**
     * 登录成功
     */
    public static final String LOGIN_SUCCESS = "Success";

    /**
     * 注销
     */
    public static final String LOGOUT = "Logout";

    /**
     * 注册
     */
    public static final String REGISTER = "Register";

    /**
     * 登录失败
     */
    public static final String LOGIN_FAIL = "Error";

    public static final String ALL_PERMISSION = "*:*:*";

    /**
     * 是否菜单外链（是）
     */
    public static final String YES_FRAME = "1";

    /**
     * 是否菜单外链（否）
     */
    public static final String NO_FRAME = "0";
    /**
     * 菜单类型（目录）
     */
    public static final String TYPE_DIR = "M";

    /**
     * 菜单类型（菜单）
     */
    public static final String TYPE_MENU = "C";

    /**
     * 菜单类型（按钮）
     */
    public static final String TYPE_BUTTON = "F";

    /**
     * 资源映射路径 前缀
     */
    public static final String RESOURCE_PREFIX = "/profile";

}
