package com.example.fastboot.server.sys.service;


import com.example.fastboot.server.sys.model.SysConfig;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author liuzhaobo
 */
public interface ISysConfigService {
    /**
     * 加载所有的配置到redis中
     */
    void loadingConfigCache();

    /**
     * 根据键列表查询系统配置历史记录。
     *
     * @param key 键。
     * @return 返回一个Sysconfig对象的列表，这些对象代表了与键列表匹配的系统配置历史记录。
     */
    SysConfig getSysConfigByKey(@Param("key") String key);

    /**
     * 根据名称获取值。
     *
     * @param name 参数的名称，用于查找对应的值。
     * @return 返回与名称匹配的值。如果找不到匹配的值，返回null。
     */
    String getValueByName(@Param("name") String name);

    /**
     * 获取所有系统配置
     *
     * @return 所有系统配置
     */
    List<SysConfig> listAllSysConfig();

    /**
     * 获取图文验证码是否开启
     * @return true开启，false关闭
     */
    boolean isCaptchaEnabled();

}
