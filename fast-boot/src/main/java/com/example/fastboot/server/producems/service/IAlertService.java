package com.example.fastboot.server.producems.service;

import com.example.fastboot.server.producems.model.Producemanage;


/**
 * @Author: LiuZhaobo
 * @Date: 2021/10/17/9:52
 */
public interface IAlertService {


    /**
     * 保存消息
     *
     * @param producemanage
     * @param contentDescription
     * @param managerGuids
     * @param alertType
     */
    void saveMessage(Producemanage producemanage, String contentDescription, String[] managerGuids, int alertType);

    /**
     * 保存消息负责人
     *
     * @param messageGuid
     * @param managerGuids
     */
    void saveManager(String messageGuid, String[] managerGuids);
}
