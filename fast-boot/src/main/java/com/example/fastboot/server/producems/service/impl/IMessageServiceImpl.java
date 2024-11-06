package com.example.fastboot.server.producems.service.impl;

import com.example.fastboot.common.response.PageResponse;
import com.example.fastboot.server.producems.mapper.AlertMapper;
import com.example.fastboot.server.producems.model.MessageToPerson;
import com.example.fastboot.server.producems.model.Producemanage;
import com.example.fastboot.server.producems.service.IMessageService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * @Author bo
 * @Date 2024 11 05 16 35
 **/
@Transactional
@Service
public class IMessageServiceImpl implements IMessageService {

    @Autowired
    private AlertMapper alertMapper;


    @Override
    public PageResponse listMessageAlerts(MessageToPerson messageToPerson, String userGuid) {
        PageHelper.startPage(messageToPerson.getCurrentPage(), messageToPerson.getPageSize());
        List<MessageToPerson> messageToPersonList = alertMapper.listMessageAlerts(userGuid,messageToPerson.getReadFlag());
        PageInfo<MessageToPerson> messageToPersonPageInfo = new PageInfo<>(messageToPersonList);
        return new PageResponse<>(messageToPersonPageInfo);
    }

    @Override
    public void updateMessageReadFlag(String userGuid, String messageGuid) {
        alertMapper.updateMessageReadFlag(userGuid, messageGuid);

    }
}
