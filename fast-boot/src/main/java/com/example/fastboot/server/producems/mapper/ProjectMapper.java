package com.example.fastboot.server.producems.mapper;


import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectMapper {

    /**
     * 根据产品唯一标识获取项目数量
     *
     * @param guid
     */
    int countByProduceGuid(String guid);
}
