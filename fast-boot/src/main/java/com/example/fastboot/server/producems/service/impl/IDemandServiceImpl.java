package com.example.fastboot.server.producems.service.impl;

import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import com.example.fastboot.common.enums.DemandItemDealStateEnum;
import com.example.fastboot.common.enums.MessageTypeEnum;
import com.example.fastboot.common.enums.TeamResourceEnum;
import com.example.fastboot.common.response.PageResponse;
import com.example.fastboot.common.security.LoginUser;
import com.example.fastboot.server.producems.mapper.DemandMapper;
import com.example.fastboot.server.producems.mapper.ProducemanageMapper;
import com.example.fastboot.server.producems.model.*;
import com.example.fastboot.server.producems.service.IAlertService;
import com.example.fastboot.server.producems.service.IDemandService;
import com.example.fastboot.server.producems.vo.CountDemandConfirmVo;
import com.example.fastboot.server.producems.vo.DemandConfirmDetailVo;
import com.example.fastboot.server.sys.controller.Base;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * @Author bo
 * @Date 2024 10 16 20 58
 **/
@Service
@Transactional
public class IDemandServiceImpl implements IDemandService {
    @Autowired
    private ProducemanageMapper producemanageMapper;
    @Autowired
    private DemandMapper demandMapper;
    @Autowired
    private IAlertService alertService;

    @Override
    public PageResponse listDemandConfirm(Producemanage producemanage) {

        LoginUser loginUser = (LoginUser) Base.getCreatUserDetails();
        //获取用户锁定产品
        List<LockProduceToUser> lockProduceToUserList = producemanageMapper.listLockProduceToUserByUser(loginUser.getUserGuid());
        //获取list的produceGuid属性的值生成新的数组
        String[] produceGuids = lockProduceToUserList.stream().map(LockProduceToUser::getProduceGuid).toArray(String[]::new);
        PageHelper.startPage(producemanage.getCurrentPage(), producemanage.getPageSize());
        List<Producemanage> producemanageList = producemanageMapper.listProduce(producemanage, produceGuids);
        for (Producemanage item : producemanageList) {
            String guid = item.getGuid();
            Demandmanage demandmanage = new Demandmanage();
            demandmanage.setProduceGuid(guid);
            Demandmanage queryDemandManage = demandMapper.getDemand(demandmanage);
            if (queryDemandManage != null) {
                item.setDemandGuid(queryDemandManage.getGuid());
                List<CountDemandConfirmVo> countDemandConfirmVoList = demandMapper.countDemandConfirm(guid);
                int allCount = 0;
                for (CountDemandConfirmVo countDemandConfirmVo : countDemandConfirmVoList) {
                    allCount += countDemandConfirmVo.getCount();
                    switch (countDemandConfirmVo.getDemandConfiemedState()) {
                        case 1:
                            item.setWaitConfirmCount(countDemandConfirmVo.getCount());
                            break;
                        case 2:
                            item.setConfirmedCount(countDemandConfirmVo.getCount());
                            break;
                        case 3:
                            item.setNoPassCount(countDemandConfirmVo.getCount());
                            break;
                        default:
                            break;
                    }
                }
                item.setDemandCount(allCount);
                Nodes nodes = new Nodes();
                nodes.setModuleGuid(guid);
                int devFinishedCount = demandMapper.countDevFinish(guid)
                        + (queryDemandManage.getDevFinishFlag() ? demandMapper.listNodes(nodes).size() : 0);
                item.setDevFinishedCount(devFinishedCount);
            }
        }
        PageInfo<Producemanage> demandConfirmCountVoPageInfo = new PageInfo<>(producemanageList);
        return new PageResponse<>(demandConfirmCountVoPageInfo);

    }

    @Override
    public PageResponse listDemandConfirmDetail(DemandConfirmDetailVo demandConfirmDetailVo) {
        PageHelper.startPage(demandConfirmDetailVo.getCurrentPage(), demandConfirmDetailVo.getPageSize());
        List<DemandItem> demanditemList = demandMapper.listDemandConfirmDetail(demandConfirmDetailVo);
        PageInfo<DemandItem> demandItemPageInfo = new PageInfo<>(demanditemList);
        return new PageResponse<>(demandItemPageInfo);
    }

    @Override
    public void updateDemandConfirmDetail(String demandConfirmList, String demandGuid, String produceGuid) {
        List<DemandItem> demanditemList = JSONArray.parseArray(demandConfirmList, DemandItem.class);
        if (demanditemList != null && demanditemList.size() != 0) {
            for (DemandItem demanditem : demanditemList) {
                demandMapper.updateDemandConfirmDetail(demanditem);
            }
        }
        String creatUserName = Base.getCreatUserName();
        for (DemandItem demanditem : demanditemList) {
            ArrayList<Integer> typeList = new ArrayList<>();
            int alertType = 0;
            String contentDescription = "";
            Producemanage queryProducemanage = new Producemanage();
            queryProducemanage.setGuid(produceGuid);
            Producemanage producemanage = producemanageMapper.getProduce(queryProducemanage);
            if (demanditem.getDemandConfiemedState() == DemandItemDealStateEnum.CONFIRMED.getCode()) {
                //表示需求已确认
                //判断是不是需求变更，根据demandItem的noddeGuid去需求变更表查如果是需求变更则写名字
                String nodeGuid = demanditem.getNodeGuid();
                //更改需求确认名、
                demandMapper.updateDemandTranceConfirmName(nodeGuid, creatUserName);
                int count = demandMapper.countDemandTranceByNodeGuid(nodeGuid);
                if (count == 0) {//说明不是需求变更
                    continue;
                }
                //查询有关的项目组成员
                typeList.add(TeamResourceEnum.TEST_GROUP.getCode());
                alertType = MessageTypeEnum.WAIT_CHECK.getCode();
                contentDescription = producemanage.getName() + demanditem.getNodeName() + "待测试";
            } else if (demanditem.getDemandConfiemedState() == DemandItemDealStateEnum.NOPASS.getCode()) {
                //查询有关的项目组成员
                typeList.add(TeamResourceEnum.RD_GROUP.getCode());
                alertType = MessageTypeEnum.DEMAND_CONFIRM_NOPASS.getCode();
                contentDescription = demanditem.getNodeName();
            } else if (demanditem.getDemandConfiemedState() == DemandItemDealStateEnum.WAIT_CONFIRMED.getCode()) {
                //查询有关的项目组成员
                typeList.add(TeamResourceEnum.DEMAND_GROUP.getCode());
                alertType = MessageTypeEnum.DEMAND_WAIT_CONFIRM.getCode();
                contentDescription = demanditem.getNodeName();
            }
            if (typeList.size() == 0) {
                return;
            }
            List<Producemember> producememberList = producemanageMapper.listProduceMemberByType(produceGuid, typeList);
            if (producememberList.size() == 0) {
                continue;
            }
            String[] managerGuids = producememberList.stream().map(item -> item.getManagerGuid()).toArray(String[]::new);
            //消息存库
            alertService.saveMessage(producemanage, contentDescription, managerGuids, alertType);
        }
    }
}
