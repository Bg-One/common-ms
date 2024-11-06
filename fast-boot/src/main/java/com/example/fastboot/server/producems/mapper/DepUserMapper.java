package com.example.fastboot.server.producems.mapper;

import com.example.fastboot.server.producems.model.DepUser;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author bo
 * @Date 2024 11 06 10 37
 **/
@Mapper
@Repository
public interface DepUserMapper {

    /**
     * 获取全部人员列变
     */
    List<DepUser> listDepUser();
}
