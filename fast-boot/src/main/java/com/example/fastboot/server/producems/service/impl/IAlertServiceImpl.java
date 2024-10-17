package com.example.fastboot.server.producems.service.impl;

import com.alibaba.fastjson2.JSONObject;
import com.example.fastboot.common.websocket.WebSocketService;
import com.example.fastboot.server.producems.mapper.AlertMapper;
import com.example.fastboot.server.producems.model.MessageRecord;
import com.example.fastboot.server.producems.model.MessageToPerson;
import com.example.fastboot.server.producems.model.Producemanage;
import com.example.fastboot.server.producems.service.IAlertService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

import java.util.UUID;

/**
 * @Author bo
 * @Date 2024 10 17 09 42
 **/
@Service
@Transactional
@Slf4j
public class IAlertServiceImpl implements IAlertService {


    @Autowired
    private AlertMapper alertMapper;
    @Autowired
    private WebSocketService webSocketService;

    @Override
    public void saveMessage(Producemanage producemanage, String contentDescription, String[] managerGuids, int alertType) {
        String messageGuid = UUID.randomUUID().toString();

        MessageRecord messageRecord = new MessageRecord();
        messageRecord.setGuid(messageGuid);
        messageRecord.setProduceGuid(producemanage.getGuid());
        messageRecord.setProduceNo(producemanage.getNumber());
        messageRecord.setAlertType(alertType);
        messageRecord.setContentDescription(contentDescription);
        alertMapper.insertMessageRecord(messageRecord);

        //负责人入库
        saveManager(messageGuid, managerGuids);

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("type", "msgAlert");
        //websocket通知有消息来了
        for (String managerGuid : managerGuids) {
            try {
                webSocketService.sendMessage(managerGuid, jsonObject.toString());
            } catch (IOException e) {
                log.info("消息提醒失败，不影响数据存储");
            }
        }

    }

    @Override
    public void saveManager(String messageGuid, String[] managerGuids) {
        //负责人存库
        for (String guid : managerGuids) {
            MessageToPerson messageToPerson = new MessageToPerson();
            messageToPerson.setMessageGuid(messageGuid);
            messageToPerson.setResponsiblePersonGuid(guid);
            alertMapper.insertMessageToPerson(messageToPerson);
        }
    }
}
