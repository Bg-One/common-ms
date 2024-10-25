package com.example.fastboot.server.producems.service;

import com.example.fastboot.common.response.PageResponse;
import com.example.fastboot.server.producems.model.*;
import com.example.fastboot.server.producems.vo.DemandConfirmDetailVo;
import com.example.fastboot.server.producems.vo.DocumentCountVo;

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
     * @param nodes
     * @return
     */
    List<Nodes> listNodes(Nodes nodes);

    /**
     * 获取需求信息
     *
     * @param guid
     * @return
     */
    DemandItem getNodes(String guid);

    /**
     * 统计需求跟踪数量
     *
     * @param producemanage
     * @return
     */
    PageResponse countDemandTraceByProduce(Producemanage producemanage);

    /**
     * 需求跟踪相关产品
     *
     * @param produceGuid
     * @return
     */
    void relatedProduce(String produceGuid);

    /**
     * 获取需求跟踪详情页面
     *
     * @param demandtrace
     * @return
     */
    PageResponse listDemandTrace(Demandtrace demandtrace);

    /**
     * 更新需求跟踪详细描述
     *
     * @param guid
     * @param detailDescription
     */
    void updateDemandTraceDetailDes(String guid, String detailDescription);

    /**
     * 删除需求跟踪
     *
     * @param guid
     */
    void deleteteDemandTrace(String guid);

    /**
     * 新增需求跟踪
     *
     * @param demandtrace
     */
    void addDemandTrace(Demandtrace demandtrace);

    /**
     * 更新需求跟踪
     *
     * @param demandTraceList
     */
    void editDemandTrace(String demandTraceList);

    /**
     * 获取需求列表
     *
     * @param demandmanage
     * @return
     */
    PageResponse listDemand(Demandmanage demandmanage);

    /**
     * 需求、概要、数据库、接口设计
     *
     * @return
     */
    DocumentCountVo countStatusDemand();

    /**
     * 需求流转
     *
     * @param guids
     * @param staus
     */
    void statusTransfer(String[] guids, int staus);

    /**
     * 删除需求
     *
     * @param guids
     * @return
     */
    void deleteDemand(String[] guids);

    /**
     * 新增需求
     *
     * @param produceGuid
     */
    String addDemand(String produceGuid);

    /**
     * 更新需求信息
     *
     * @param demandmanage
     */
    void updateDemand(Demandmanage demandmanage);

    /**
     * 获取需求变更记录
     *
     * @param demandGuid
     * @return
     */
    List<Demandchangerecord> listDemandChangeRecord(String demandGuid);

    /**
     * 获取需求信息
     *
     * @param guid
     * @return
     */
    Demandmanage getDemand(String guid);

    /**
     * 获取需求术语列表
     *
     * @param demandGuid
     * @return
     */
    List<Demandterm> listDemandTerm(String demandGuid);

    /**
     * 新增或编辑需求术语
     *
     * @param demandTermList
     */
    void addOrEditDemandTerm(String demandTermList);

    /**
     * 删除需求术语
     *
     * @param guid
     */
    void deleteDemandTerm(String guid);

    /**
     * 获取待确认问题列表
     *
     * @param guid
     * @return
     */
    List<Issuestobeconfirmed> listIssuesToBeConfirmed(String guid);

    /**
     * 新增或编辑待确认问题
     *
     * @param issuesToConfirmList
     */
    void addOrEditIssuesToConfirm(String issuesToConfirmList);

    /**
     * 删除待确认问题列表
     *
     * @param guid
     */
    void deleteIssuesToBeConfirmed(String guid);

    /**
     * 获取软件详细设计
     * @param nodeGuid
     * @return
     */
    Detaileddesign getDetailDesign(String nodeGuid);

    /**
     * 新增或编辑详细设计
     * @param detaileddesign
     */
    void addOrEditDetailDesign(Detaileddesign detaileddesign);
}
