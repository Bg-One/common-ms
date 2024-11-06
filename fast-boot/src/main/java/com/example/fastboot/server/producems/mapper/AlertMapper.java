package com.example.fastboot.server.producems.mapper;

import com.example.fastboot.server.producems.model.MessageRecord;
import com.example.fastboot.server.producems.model.MessageToPerson;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author bo
 * @Date 2024 10 17 10 01
 **/
@Mapper
@Repository
public interface AlertMapper {
    /**
     * 新增消息提醒记录
     *
     * @param messageRecord
     */
    void insertMessageRecord(@Param("messageRecord") MessageRecord messageRecord);

    /**
     * 新增消息负责人
     *
     * @param messageToPerson
     */
    void insertMessageToPerson(@Param("messageToPerson") MessageToPerson messageToPerson);

    /**
     * 消息已读
     *
     * @param userGuid
     * @param messageGuid
     */
    void updateMessageReadFlag(@Param("userGuid") String userGuid, @Param("messageGuid") String messageGuid);

    /**
     * 获取用户关联的消息提醒
     *
     * @param userGuid
     * @return
     */
    List<MessageToPerson> listMessageAlerts(@Param("userGuid") String userGuid, @Param("readFlag") int readFlag);
}
