package com.example.fastboot.server.sys.service.impl;


import com.example.fastboot.common.constant.CacheConstants;
import com.example.fastboot.common.redis.RedisCache;
import com.example.fastboot.server.sys.mapper.SysConfigMapper;
import com.example.fastboot.server.sys.model.SysConfig;
import com.example.fastboot.server.sys.service.ISysConfigService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.Collection;
import java.util.List;

import static com.example.fastboot.common.constant.SysConfigConstant.CAPTCHA_ENABLED;


/**
 * 参数配置 服务层实现
 *
 * @author ruoyi
 */
@Service
public class SysConfigServiceImpl implements ISysConfigService {
    @Autowired
    private SysConfigMapper configMapper;

    @Autowired
    private RedisCache redisCache;

    /**
     * 项目启动时，初始化参数到缓存
     */
    @PostConstruct
    public void init() {
        loadingConfigCache();
    }


    /**
     * 加载参数缓存数据
     */
    @Override
    public void loadingConfigCache() {
        List<SysConfig> configsList = this.listAllSysConfig();
        for (SysConfig config : configsList) {
            redisCache.setCacheObject(getCacheKey(config.getName()), config.getConfigValue());
        }
    }

    @Override
    public SysConfig getSysConfigByKey(String key) {
        return configMapper.getHisSysConfigByKey(key);
    }

    @Override
    public String getValueByName(String name) {
        String configValue = redisCache.getCacheObject(getCacheKey(name));
        if (StringUtils.isNotBlank(name)) {
            return configValue;
        }
        return configMapper.getValueByName(name);
    }

    @Override
    public List<SysConfig> listAllSysConfig() {
        return configMapper.listAllSysConfig(new SysConfig());
    }

    @Override
    public boolean isCaptchaEnabled() {
        String configValue = this.getValueByName(CAPTCHA_ENABLED);
        return Boolean.parseBoolean(configValue);
    }

    /**
     * 设置cache key
     *
     * @param configKey 参数键
     * @return 缓存键key
     */
    private String getCacheKey(String configKey) {
        return CacheConstants.SYS_CONFIG_KEY + configKey;
    }
}
