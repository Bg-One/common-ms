package com.example.fastboot.server.sys.mapper;

import com.example.fastboot.server.sys.model.SysLogininfor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author bo
 * @Date 2024 07 26 11 00
 **/
@Repository
public interface SysLogininforMapper {
    /**
     * 插入登录信息
     *
     * @param logininfor
     */
    void insertLogininfor(SysLogininfor logininfor);

    /**
     * 清理日志
     */
    void cleanLogininfor();

    /**
     * 删除指定登录日志
     *
     * @param guids 唯一标识数组
     */
    void deleteLogininforByGuids(String[] guids);

    /**
     * 获取登录信息
     * @param logininfor 登录信息
     * @return
     */
    List<SysLogininfor> selectLogininforList(SysLogininfor logininfor);
}
