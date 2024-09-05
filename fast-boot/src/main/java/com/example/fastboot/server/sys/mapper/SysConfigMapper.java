package com.example.fastboot.server.sys.mapper;


import com.baomidou.dynamic.datasource.annotation.DS;
import com.example.fastboot.server.sys.model.SysConfig;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author bo
 * @Date 2024 05 02 15 21
 **/
@Repository
public interface SysConfigMapper {
    /**
     * 根据键列表查询系统配置历史记录。
     *
     * @param key 键。
     * @return 返回一个HisSysconfig对象的列表，这些对象代表了与键列表匹配的系统配置历史记录。
     */
    SysConfig getHisSysConfigByKey(@Param("key") String key);

    /**
     * 根据名称获取值。
     *
     * @param name 参数的名称，用于查找对应的值。
     * @return 返回与名称匹配的值。如果找不到匹配的值，返回null。
     */
    String getValueByName(String name);

    /**
     * 获取所有系统配置
     *
     * @return 获取全部的系统配置
     */
    List<SysConfig> listAllSysConfig(SysConfig sysConfig);
}
