package com.example.fastboot.common.config;


import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;


/**
 * @author liuzhaobo
 */
@Configuration
@Data
public class FastCommonConfig {

    /**
     * 上传路径
     */
    @Value("${fast-common.profile}")
    public String profile;

    /**
     * 用户锁定时间
     */
    @Value(value = "${fast-common.user.password.lockTime}")
    private int lockTime;
    /**
     * 用户锁定次数
     */
    @Value(value = "${fast-common.user.password.maxRetryCount}")
    private int maxRetryCount;

    @Value("${fast-common.login-address-switch}")
    private boolean loginAddressSwitch;

    /**
     * 获取导入上传路径
     */
    public String getImportPath() {
        return getProfile() + "/import";
    }

    /**
     * 获取头像上传路径
     */
    public String getAvatarPath() {
        return getProfile() + "/avatar";
    }

    /**
     * 获取下载路径
     */
    public String getDownloadPath() {
        return getProfile() + "/download/";
    }

    /**
     * 获取上传路径
     */
    public String getUploadPath() {
        return getProfile() + "/upload";
    }

}
