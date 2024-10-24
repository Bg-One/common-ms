package com.example.fastboot.server.producems.mapper;

import com.example.fastboot.server.producems.model.*;
import com.example.fastboot.server.producems.vo.DemandConfirmStateCountVo;
import com.example.fastboot.server.producems.vo.DemandConfirmDetailVo;
import com.example.fastboot.server.producems.vo.DocumentStatusCountVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

/**
 * @Author bo
 * @Date 2024 10 16 21 07
 **/
@Mapper
@Repository
public interface DemandMapper {
    /**
     * 获取需求信息
     *
     * @param demandmanage
     * @return
     */
    Demandmanage getDemand(Demandmanage demandmanage);

    List<DemandConfirmStateCountVo> countDemandConfirm(String guid);

    /**
     * 获取已完成数量
     *
     * @param guid
     * @return
     */
    int countDevFinish(String guid);

    /**
     * 获取节点信息
     *
     * @param nodes
     * @return
     */
    List<Nodes> listNodes(Nodes nodes);

    /**
     * 获取需求确认详情
     *
     * @param demandConfirmDetailVo
     * @return
     */
    List<DemandItem> listDemandConfirmDetail(DemandConfirmDetailVo demandConfirmDetailVo);

    /**
     * 更新需求确认详情
     *
     * @param demanditem
     */
    void updateDemandConfirmDetail(DemandItem demanditem);

    /**
     * 更新需求变更
     *
     * @param nodeGuid
     */
    void updateDemandTranceConfirmName(@Param("nodeGuid") String nodeGuid, @Param("userName") String userName);

    /**
     * 统计某一节点的需求变更数量
     *
     * @param nodeGuid
     * @return
     */
    int countDemandTranceByNodeGuid(String nodeGuid);

    /**
     * 获取节点信息
     *
     * @param guid
     * @return
     */
    DemandItem getNodes(String guid);

    /**
     * 更改需求处理状态
     *
     * @param nodeGuid
     * @param status
     */
    void updateDealState(@Param("nodeGuid") String nodeGuid, @Param("status") int status);

    /**
     * 获取需求跟踪列表
     *
     * @param producemanage
     * @param produceGuids
     * @return
     */
    List<Demandtrace> listDemandTraceByProduce(@Param("producemanage") Producemanage producemanage, @Param("produceGuids") String[] produceGuids);

    /**
     * 获取全部需求变更记录
     *
     * @param producemanage
     * @param produceGuids
     * @return
     */
    List<Demandtrace> listAllDemandTraceByProduce(@Param("producemanage") Producemanage producemanage, @Param("produceGuids") String[] produceGuids);

    /**
     * 获取去重后的需求跟踪关联的产品唯一标识
     *
     * @return
     */
    List<String> listDistinctDemandTraceProduceGuid();

    /**
     * 新增需求跟踪
     *
     * @param demandtrace
     */
    void insertDemandtrace(Demandtrace demandtrace);

    /**
     * 获取需求跟踪列表
     *
     * @param demandtrace
     * @return
     */
    List<Demandtrace> listDemandTrace(@Param("demandtrace") Demandtrace demandtrace, @Param("progressStatusList") List<String> progressStatusList);

    /**
     * 更新需求跟踪详情详细描述
     *
     * @param guid
     * @param detailDescription
     */
    void updateDemandTraceDetailDes(String guid, String detailDescription);

    /**
     * 删除需求变更记录
     *
     * @param guid
     */
    void deleteteDemandTrace(String guid);

    /**
     * 新增需求跟踪记录
     *
     * @param demandtrace
     */
    void addDemandtraceAll(@Param("demandtrace") Demandtrace demandtrace);

    /**
     * 更新需求变更
     *
     * @param demandtrace
     */
    void updateDemandtrace(@Param("demandtrace") Demandtrace demandtrace);

    /**
     * 统计需求数量
     *
     * @return
     */
    List<DocumentStatusCountVo> countStatusDemand(@Param("produceGuids") String[] produceGuids);

    /**
     * 需求流转
     *
     * @param guid
     * @param staus
     */
    void statusTransfer(@Param("guid") String guid, @Param("staus") int staus);

    /**
     * 删除需求
     *
     * @param guids
     */
    void deleteDemand(String[] guids);

    /**
     * 新增需求
     *
     * @param produceGuid
     * @param demandGuid
     */
    void insertDemand(@Param("produceGuid") String produceGuid, @Param("demandGuid") String demandGuid);

    /**
     * 新增需求节点
     *
     * @param nodesArrayList
     */
    void insertNodes(@Param("nodelist") ArrayList<Nodes> nodesArrayList);

    /**
     * 获取需求关联的产品标识去重
     *
     * @return
     */
    List<String> listDistinctDemandProduceGuid();

    /**
     * 更新需求管理信息
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
}
