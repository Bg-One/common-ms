package com.example.fastboot.server.producems.service;

import com.example.fastboot.common.response.PageResponse;
import com.example.fastboot.server.producems.model.DemandItem;
import com.example.fastboot.server.producems.model.Nodes;
import com.example.fastboot.server.producems.model.Producemanage;
import com.example.fastboot.server.producems.vo.DemandConfirmDetailVo;

import java.util.List;

/**
 * @Author bo
 * @Date 2024 10 16 20 57
 **/
public interface IDemandService {
    /**
     * 统计需求确认数量列表
     *
     * @param producemanage
     * @return
     */
    PageResponse countDemandConfirm(Producemanage producemanage);

    /**
     * 获取需求确认详情
     *
     * @param demandConfirmDetailVo
     * @return
     */
    PageResponse listDemandConfirmDetail(DemandConfirmDetailVo demandConfirmDetailVo);

    /**
     * 修改需求确认详情
     *
     * @param demandConfirmList
     * @param demandGuid
     */
    void updateDemandConfirmDetail(String demandConfirmList, String demandGuid, String produceGuid);

    /**
     *
     * @param nodes
     * @return
     */
    List<Nodes> listNodes(Nodes nodes);

    /**
     * 获取需求信息
     * @param guid
     * @return
     */
    DemandItem getNodes(String guid);
}
