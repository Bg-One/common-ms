package com.example.fastboot.server.producems.mapper;

import com.example.fastboot.server.producems.model.MessageRecord;
import com.example.fastboot.server.producems.model.MessageToPerson;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

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
    void insertMessageRecord(MessageRecord messageRecord);

    /**
     * 新增消息负责人
     *
     * @param messageToPerson
     */
    void insertMessageToPerson(MessageToPerson messageToPerson);
}
