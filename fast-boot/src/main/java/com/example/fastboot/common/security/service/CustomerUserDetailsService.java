package com.example.fastboot.common.security.service;


import com.example.fastboot.common.config.FastCommonConfig;
import com.example.fastboot.common.constant.CacheConstants;
import com.example.fastboot.common.enums.CommonResultEnum;
import com.example.fastboot.common.enums.UserStatusEnum;
import com.example.fastboot.common.exception.ServiceException;
import com.example.fastboot.common.redis.RedisCache;
import com.example.fastboot.common.security.LoginUser;
import com.example.fastboot.server.sys.model.SysUser;
import com.example.fastboot.server.sys.service.ISysUserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.Objects;

import static com.example.fastboot.common.enums.CommonResultEnum.PASSWORD_ERROR_COUNT_OVER;


/**
 * @author liuzhaobo
 */
@Service
@Slf4j
public class CustomerUserDetailsService implements UserDetailsService {

    @Autowired
    private ISysUserService userService;

    @Autowired
    private SysPermissionService permissionService;
    @Autowired
    private RedisCache redisCache;
    @Autowired
    private FastCommonConfig fastCommonConfig;


    @Override
    public UserDetails loadUserByUsername(String username) {
        SysUser user = userService.selectUserByUserName(username);
        if (Objects.isNull(user)) {
            throw new ServiceException(CommonResultEnum.USER_UN);
        } else if (UserStatusEnum.DELETED.getCode().equals(user.getDelFlag())) {
            throw new ServiceException(CommonResultEnum.USER_DEL);
        } else if (UserStatusEnum.DISABLE.getCode().equals(user.getStatus())) {
            throw new ServiceException(CommonResultEnum.USER_DISABLE);
        }
        Integer retryCount = redisCache.getCacheObject(getCacheKey(username));
        if (retryCount == null) {
            retryCount = 0;
        }
        if (retryCount >= fastCommonConfig.getMaxRetryCount()) {
            throw new ServiceException(PASSWORD_ERROR_COUNT_OVER);
        }
        return createLoginUser(user);
    }

    /**
     * 生成userDetails
     *
     * @param user 系统用户类
     * @return userDetails
     */
    public UserDetails createLoginUser(SysUser user) {
        return new LoginUser(user.getUserGuid(), user.getDeptGuid(), user, permissionService.getMenuPermission(user));
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

}
