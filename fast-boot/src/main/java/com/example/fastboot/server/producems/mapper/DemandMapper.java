package com.example.fastboot.server.producems.mapper;

import com.example.fastboot.server.producems.model.DemandItem;
import com.example.fastboot.server.producems.model.Demandmanage;
import com.example.fastboot.server.producems.model.Nodes;
import com.example.fastboot.server.producems.vo.DemandConfirmStateCountVo;
import com.example.fastboot.server.producems.vo.DemandConfirmDetailVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

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
     * @param guid
     * @return
     */
    DemandItem getNodes(String guid);
}
