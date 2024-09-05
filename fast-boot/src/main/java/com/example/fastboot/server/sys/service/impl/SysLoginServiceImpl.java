package com.example.fastboot.server.sys.service.impl;


import com.example.fastboot.common.config.FastCommonConfig;
import com.example.fastboot.common.constant.CacheConstants;
import com.example.fastboot.common.constant.Constants;
import com.example.fastboot.common.enums.CommonResultEnum;
import com.example.fastboot.common.exception.ServiceException;
import com.example.fastboot.common.redis.RedisCache;
import com.example.fastboot.common.security.LoginUser;
import com.example.fastboot.common.security.service.TokenService;
import com.example.fastboot.common.utils.ip.AddressUtils;
import com.example.fastboot.common.utils.ip.IpUtils;
import com.example.fastboot.server.sys.model.SysLogininfor;
import com.example.fastboot.server.sys.model.SysUser;
import com.example.fastboot.server.sys.service.ISysConfigService;
import com.example.fastboot.server.sys.service.ISysLoginService;
import com.example.fastboot.server.sys.service.ISysLogininforService;
import com.example.fastboot.server.sys.service.ISysUserService;
import com.example.fastboot.server.sys.vo.LoginVo;
import eu.bitwalker.useragentutils.UserAgent;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.scheduling.annotation.Async;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;


import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static com.example.fastboot.common.constant.CacheConstants.CAPTCHA_CODE_KEY;
import static com.example.fastboot.common.constant.SysConfigConstant.BLACK_IP_LIST;


/**
 * @Author bo
 * @Date 2024 07 24 11 33
 **/
@Service
public class SysLoginServiceImpl implements ISysLoginService {
    @Autowired
    private ISysConfigService iSysConfigService;
    @Autowired
    private RedisCache redisCache;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private ISysUserService iSysUserService;
    @Autowired
    private FastCommonConfig fastCommonConfig;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private ISysLogininforService iSysLogininforService;

    @Override
    public String login(LoginVo loginVo) {
        String userName = loginVo.getUserName();
        String password = loginVo.getPassword();
        String code = loginVo.getCode();
        String uuid = loginVo.getUuid();
        // 验证码校验
        validateCaptcha(userName, code, uuid);
        // 登录ip前置校验
        ipPreCheck(userName);
        // 用户验证
        Authentication authentication = null;
        try {
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userName, password);
            authentication = authenticationManager.authenticate(authenticationToken);
        } catch (Exception e) {
            if (e instanceof BadCredentialsException) {
                //密码错误
                Integer retryCount = redisCache.getCacheObject(getCacheKey(userName));
                if (retryCount == null) {
                    retryCount = 0;
                }
                retryCount = retryCount + 1;
                redisCache.setCacheObject(getCacheKey(userName), retryCount, fastCommonConfig.getLockTime(), TimeUnit.MINUTES);
                insertLoginInfo(userName, "密码错误", Constants.LOGIN_FAIL);
                throw new ServiceException(CommonResultEnum.PASSWORD_ERROR);
            } else if (e.getCause() instanceof ServiceException) {
                insertLoginInfo(userName, "账号错误", Constants.LOGIN_FAIL);
                throw ((ServiceException) e.getCause());
            } else {
                insertLoginInfo(userName, "登陆失败", Constants.LOGIN_FAIL);
                throw new ServiceException(CommonResultEnum.FAILED);
            }

        }
        clearLoginRecordCache(userName);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        insertLoginInfo(userName, "登陆成功", Constants.LOGIN_SUCCESS);
        LoginUser loginUser = (LoginUser) authentication.getPrincipal();
        recordLoginInfo(loginUser.getUserGuid());
        // 生成token
        return tokenService.createToken(loginUser);
    }

    /**
     * 校验验证码
     *
     * @param username 用户名
     * @param code     验证码
     * @param uuid     唯一标识
     * @return 结果
     */
    public void validateCaptcha(String username, String code, String uuid) {
        boolean captchaEnabled = iSysConfigService.isCaptchaEnabled();
        if (captchaEnabled) {
            String verifyKey = CAPTCHA_CODE_KEY + uuid;
            String captcha = redisCache.getCacheObject(verifyKey);
            if (captcha == null) {
                insertLoginInfo(username, "验证码失效", Constants.LOGIN_FAIL);
                throw new ServiceException(CommonResultEnum.CAPTCHA_EXPIRED);
            }
            redisCache.deleteObject(verifyKey);
            if (!code.equalsIgnoreCase(captcha)) {
                insertLoginInfo(username, "验证码错误", Constants.LOGIN_FAIL);
                throw new ServiceException(CommonResultEnum.CAPTCHA_ERROR);
            }
        }
    }

    /**
     * 登录前置校验
     */
    public void ipPreCheck(String userName) {
        // IP黑名单校验
        String blackStr = iSysConfigService.getValueByName(BLACK_IP_LIST);
        if (IpUtils.isMatchedIp(blackStr, IpUtils.getIpAddr())) {
            insertLoginInfo(userName, "该ip封禁", Constants.LOGIN_FAIL);
            throw new ServiceException(CommonResultEnum.CAPTCHA_ERROR);
        }
    }

    /**
     * 记录登录信息
     *
     * @param userGuid 用户userGuid
     */
    public void recordLoginInfo(String userGuid) {
        SysUser sysUser = new SysUser();
        sysUser.setUserGuid(userGuid);
        sysUser.setLoginIp(IpUtils.getIpAddr());
        sysUser.setLoginDate(new Date());
        iSysUserService.updateUserProfile(sysUser);
    }

    /**
     * 登录账户密码错误次数缓存键名
     *
     * @param username 用户名
     * @return 缓存键key
     */
    private String getCacheKey(String username) {
        return CacheConstants.PWD_ERR_CNT_KEY + username;
    }

    /**
     * 清理登陆缓存
     *
     * @param loginName
     */
    public void clearLoginRecordCache(String loginName) {
        if (redisCache.hasKey(getCacheKey(loginName))) {
            redisCache.deleteObject(getCacheKey(loginName));
        }
    }

    @Async
    @Override
    public void insertLoginInfo(String userName, String message, String status) {
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = servletRequestAttributes.getRequest();
        UserAgent userAgent = UserAgent.parseUserAgentString(request.getHeader("User-Agent"));
        String ip = IpUtils.getIpAddr();
        String address = AddressUtils.getRealAddressByIP(ip);
        // 获取客户端操作系统
        String os = userAgent.getOperatingSystem().getName();
        // 获取客户端浏览器
        String browser = userAgent.getBrowser().getName();
        // 封装对象
        SysLogininfor logininfor = new SysLogininfor();
        logininfor.setInfoGuid(UUID.randomUUID().toString());
        logininfor.setUserName(userName);
        logininfor.setIpaddr(ip);
        logininfor.setLoginLocation(address);
        logininfor.setBrowser(browser);
        logininfor.setOs(os);
        logininfor.setMsg(message);
        // 日志状态
        if (StringUtils.equalsAny(status, Constants.LOGIN_SUCCESS, Constants.LOGOUT, Constants.REGISTER)) {
            logininfor.setStatus(String.valueOf(CommonResultEnum.SUCCESS.getCode()));
        } else if (Constants.LOGIN_FAIL.equals(status)) {
            logininfor.setStatus(String.valueOf(CommonResultEnum.FAILED.getCode()));
        }
        // 插入数据
        iSysLogininforService.insertLogininfor(logininfor);
    }
}
