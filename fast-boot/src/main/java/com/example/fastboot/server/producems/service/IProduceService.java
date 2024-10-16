package com.example.fastboot.server.producems.service;

import com.example.fastboot.common.response.PageResponse;
import com.example.fastboot.server.producems.model.Producemanage;
import com.example.fastboot.server.producems.model.Producemember;

import java.util.List;

/**
 * @Author bo
 * @Date 2024 10 15 11 23
 **/
public interface IProduceService {
    /**
     * 获取所有产品信息
     *
     * @param producemanage 产品参数
     * @return
     */
    PageResponse listProduce(Producemanage producemanage);

    /**
     * 删除产品
     *
     * @param guid
     */
    void deleteProduce(String guid);

    /**
     * 获取全部产品成员列表
     *
     * @param guid
     * @return
     */
    List<Producemember> listProduceMemList(String guid);

    /**
     * 新增产品
     *
     * @param producemanage
     */
    void addProduce(Producemanage producemanage);

    /**
     * 新增审核关系
     *
     * @param produceGuids
     */
    void updateLockProduceToUser(String[] produceGuids);

    /**
     * 获取全部产品
     *
     * @return
     */
    List<Producemanage> listAllProduce();
}
