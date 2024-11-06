package com.example.fastboot.server.producems.service;

import com.example.fastboot.common.response.PageResponse;
import com.example.fastboot.server.producems.model.MessageToPerson;

import java.util.List;

/**
 * @Author bo
 * @Date 2024 11 05 16 34
 **/
public interface IMessageService {

    /**
     * 获取消息提醒列表
     *
     * @param creatUserGuid
     * @return
     */
    PageResponse listMessageAlerts(MessageToPerson messageToPerson, String creatUserGuid);

    /**
     * 消息已读
     * @param messageGuid
     */
    void updateMessageReadFlag(String userGuid,String messageGuid);
}
