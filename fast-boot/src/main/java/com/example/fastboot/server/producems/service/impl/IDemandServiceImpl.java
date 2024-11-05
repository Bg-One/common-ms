package com.example.fastboot.server.producems.service.impl;

import com.alibaba.fastjson2.JSONArray;
import com.example.fastboot.common.enums.*;
import com.example.fastboot.common.response.PageResponse;
import com.example.fastboot.common.security.LoginUser;
import com.example.fastboot.server.producems.mapper.DemandMapper;
import com.example.fastboot.server.producems.mapper.ProducemanageMapper;
import com.example.fastboot.server.producems.mapper.ProjectMapper;
import com.example.fastboot.server.producems.model.*;
import com.example.fastboot.server.producems.service.IAlertService;
import com.example.fastboot.server.producems.service.IDemandService;
import com.example.fastboot.server.producems.vo.*;
import com.example.fastboot.server.sys.controller.Base;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

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
    @Autowired
    private ProjectMapper projectMapper;

    @Override
    public PageResponse countDemandConfirm(Producemanage producemanage) {

        LoginUser loginUser = (LoginUser) Base.getCreatUserDetails();
        //获取用户锁定产品
        List<LockProduceToUser> lockProduceToUserList = producemanageMapper.listLockProduceToUserByUser(loginUser.getUserGuid());
        //获取list的produceGuid属性的值生成新的数组
        String[] produceGuids = lockProduceToUserList.stream().map(LockProduceToUser::getProduceGuid).toArray(String[]::new);
        PageHelper.startPage(producemanage.getCurrentPage(), producemanage.getPageSize());
        List<Producemanage> producemanageList = producemanageMapper.listProduceByInProduceGuid(producemanage, produceGuids);
        for (Producemanage item : producemanageList) {
            String guid = item.getGuid();
            Demandmanage demandmanage = new Demandmanage();
            demandmanage.setProduceGuid(guid);
            Demandmanage queryDemandManage = demandMapper.getDemand(demandmanage);
            DemandConfirmCountVo demandConfirmCountVo = new DemandConfirmCountVo();
            if (queryDemandManage != null) {
                item.setDemandGuid(queryDemandManage.getGuid());
                List<DemandConfirmStateCountVo> demandConfirmStateCountVoList = demandMapper.countDemandConfirm(guid);
                int allCount = 0;
                for (DemandConfirmStateCountVo demandConfirmStateCountVo : demandConfirmStateCountVoList) {
                    allCount += demandConfirmStateCountVo.getCount();
                    int demandConfiemedState = demandConfirmStateCountVo.getDemandConfiemedState();
                    if (DemandItemDealStateEnum.WAIT_CONFIRMED.getCode() == demandConfiemedState) {
                        demandConfirmCountVo.setWaitConfirmCount(demandConfirmStateCountVo.getCount());
                    } else if (DemandItemDealStateEnum.CONFIRMED.getCode() == demandConfiemedState) {
                        demandConfirmCountVo.setConfirmedCount(demandConfirmStateCountVo.getCount());
                    } else if (DemandItemDealStateEnum.NOPASS.getCode() == demandConfiemedState) {
                        demandConfirmCountVo.setNoPassCount(demandConfirmStateCountVo.getCount());
                    }
                }
                demandConfirmCountVo.setDemandCount(allCount);
                Nodes nodes = new Nodes();
                nodes.setModuleGuid(guid);
                int devFinishedCount = demandMapper.countDevFinish(guid)
                        + (queryDemandManage.getDevFinishFlag() ? demandMapper.listNodes(nodes).size() : 0);
                demandConfirmCountVo.setDevFinishedCount(devFinishedCount);
            }
            item.setDemandConfirmCountVo(demandConfirmCountVo);
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
            String[] managerGuids = producememberList.stream().map(Producemember::getManagerGuid).toArray(String[]::new);
            //消息存库
            alertService.saveMessage(producemanage, contentDescription, managerGuids, alertType);
        }
    }

    @Override
    public List<Nodes> listNodes(Nodes nodes) {
        return demandMapper.listNodes(nodes);
    }

    @Override
    public DemandItem getNodes(String guid) {
        DemandItem nodes = demandMapper.getNodes(guid);
        return demandMapper.getNodes(guid);
    }

    @Override
    public PageResponse countDemandTraceByProduce(Producemanage producemanage) {
        LoginUser loginUser = (LoginUser) Base.getCreatUserDetails();
        //获取用户锁定产品
        List<LockProduceToUser> lockProduceToUserList = producemanageMapper.listLockProduceToUserByUser(loginUser.getUserGuid());
        //获取list的produceGuid属性的值生成新的数组
        String[] produceGuids = lockProduceToUserList.stream().map(LockProduceToUser::getProduceGuid).toArray(String[]::new);
        PageHelper.startPage(producemanage.getCurrentPage(), producemanage.getPageSize());
        List<Demandtrace> demandtraceList = demandMapper.listDemandTraceByProduce(producemanage, produceGuids);
        //获取全部需求变更记录
        List<Demandtrace> allDemandtraceList = demandMapper.listAllDemandTraceByProduce(producemanage, produceGuids);
        HashMap<String, DemandTraceCountVo> demandTraceCountVoHashMap = getDemandTraceCountVoHashMap(allDemandtraceList);
        for (Demandtrace item : demandtraceList) {
            Producemanage queryProduceManage = new Producemanage();
            String produceGuid = item.getProduceGuid();
            queryProduceManage.setGuid(produceGuid);
            item.setProduceName(producemanageMapper.getProduce(queryProduceManage).getName());
            DemandTraceCountVo demandTraceCountVo = demandTraceCountVoHashMap.get(produceGuid);
            item.setDemandTraceCountVo(demandTraceCountVo == null ? new DemandTraceCountVo() : demandTraceCountVo);
        }
        PageInfo<Demandtrace> demandtracePageInfo = new PageInfo<>(demandtraceList);
        return new PageResponse<>(demandtracePageInfo);
    }

    @Override
    public void relatedProduce(String produceGuid) {
        Demandtrace demandtrace = new Demandtrace();
        demandtrace.setGuid(UUID.randomUUID().toString());
        demandtrace.setProduceGuid(produceGuid);
        demandMapper.insertDemandtrace(demandtrace);
    }

    @Override
    public PageResponse listDemandTrace(Demandtrace demandtrace) {
//        if (demandtrace.getProgressStatuss() == null) {
//            List<Demandtrace> demandtraceList = new ArrayList<>();
//            PageInfo<Demandtrace> demandtracePageInfo = new PageInfo<>(demandtraceList);
//            return new PageResponse<>(demandtracePageInfo);
//        }
//        List<String> progressStatusList = Arrays.asList(demandtrace.getProgressStatuss());
        PageHelper.startPage(demandtrace.getCurrentPage(), demandtrace.getPageSize());
        List<Demandtrace> demandtraceList = demandMapper.listDemandTrace(demandtrace);
        PageInfo<Demandtrace> demandtracePageInfo = new PageInfo<>(demandtraceList);
        return new PageResponse<>(demandtracePageInfo);
    }

    @Override
    public void updateDemandTraceDetailDes(String guid, String detailDescription) {
        demandMapper.updateDemandTraceDetailDes(guid, detailDescription);
    }

    @Override
    public void deleteteDemandTrace(String guid) {
        demandMapper.deleteteDemandTrace(guid);
    }

    @Override
    public void addDemandTrace(Demandtrace demandtrace) {
        String guid = UUID.randomUUID().toString();
        demandtrace.setGuid(guid);
        demandMapper.addDemandtraceAll(demandtrace);
        ArrayList<Integer> typeList = new ArrayList<>();
        int alertType = 0;
        if (demandtrace.getDealState() == DemandTraceDealStateEnum.NEW_ADD.getCode()) {//新增
            //查询有关的项目组成员
            typeList.add(TeamResourceEnum.TECHNICAL_GROUP.getCode());
            alertType = MessageTypeEnum.MANAGE_WAIT_CONFIRM.getCode();
        }

        String produceGuid = demandtrace.getProduceGuid();
        Producemanage queryProducemanage = new Producemanage();
        queryProducemanage.setGuid(produceGuid);
        Producemanage producemanage = producemanageMapper.getProduce(queryProducemanage);
        List<Projectmember> projectmemberList = projectMapper.listProjectMemberByType(demandtrace.getProjectGuid(), typeList);
        if (projectmemberList.size() == 0) {
            return;
        }
        String[] managerGuids = projectmemberList.stream().map(Projectmember::getManagerGuid).toArray(String[]::new);
        //消息存库
        alertService.saveMessage(producemanage, demandtrace.getDemandDescription(), managerGuids, alertType);
    }

    @Override
    public void editDemandTrace(String demandTraceList) {
        List<Demandtrace> demandtraces = JSONArray.parseArray(demandTraceList, Demandtrace.class);
        for (Demandtrace demandtrace : demandtraces) {
            demandMapper.updateDemandtrace(demandtrace);
            sendMessage(demandtrace);
        }
    }

    @Override
    public PageResponse listDemand(Demandmanage demandmanage) {
        LoginUser loginUser = (LoginUser) Base.getCreatUserDetails();
        //获取用户锁定产品
        List<LockProduceToUser> lockProduceToUserList = producemanageMapper.listLockProduceToUserByUser(loginUser.getUserGuid());
        //获取list的produceGuid属性的值生成新的数组
        String[] produceGuids = lockProduceToUserList.stream().map(LockProduceToUser::getProduceGuid).toArray(String[]::new);
        PageHelper.startPage(demandmanage.getCurrentPage(), demandmanage.getPageSize());
        List<Demandmanage> demandmanageList = producemanageMapper.listDemand(demandmanage, produceGuids);
        for (Demandmanage item : demandmanageList) {
            ArrayList<Integer> teamResourceList = new ArrayList<>();
            teamResourceList.add(TeamResourceEnum.DEMAND_GROUP.getCode());
            Producemember produceMemberByType = producemanageMapper.getProduceMemberByType(item.getProduceGuid(), TeamResourceEnum.DEMAND_GROUP.getCode());
            String name = produceMemberByType != null ? produceMemberByType.getManagerName() : "";
            item.setDemandManagerName(name);
        }
        PageInfo<Demandmanage> demandmanagePageInfo = new PageInfo<>(demandmanageList);
        return new PageResponse<>(demandmanagePageInfo);
    }

    @Override
    public DocumentCountVo countStatusDemand() {
        LoginUser loginUser = (LoginUser) Base.getCreatUserDetails();
        //获取用户锁定产品
        List<LockProduceToUser> lockProduceToUserList = producemanageMapper.listLockProduceToUserByUser(loginUser.getUserGuid());
        //获取list的produceGuid属性的值生成新的数组
        String[] produceGuids = lockProduceToUserList.stream().map(LockProduceToUser::getProduceGuid).toArray(String[]::new);
        List<DocumentStatusCountVo> documentStatusCountVoList = demandMapper.countStatusDemand(produceGuids);
        int tallCount = 0;
        DocumentCountVo documentCountVo = new DocumentCountVo();
        for (DocumentStatusCountVo documentStatusCountVo : documentStatusCountVoList) {
            int status = documentStatusCountVo.getStatus();
            int count = documentStatusCountVo.getCount();
            tallCount += count;
            if (status == DocumentStatusEnum.EDIT.getCode()) {
                documentCountVo.setEditCount(count);
            } else if (status == DocumentStatusEnum.REVIEW.getCode()) {
                documentCountVo.setPreviewCount(count);
            } else if (status == DocumentStatusEnum.FINAL.getCode()) {
                documentCountVo.setFinalCount(count);
            }
        }
        documentCountVo.setAllCount(tallCount);
        return documentCountVo;
    }

    @Override
    public void statusTransfer(String[] guids, int staus) {
        for (String guid : guids) {
            demandMapper.statusTransfer(guid, staus);
        }
    }

    @Override
    public void deleteDemand(String[] guids) {
        demandMapper.deleteDemand(guids);
    }

    @Override
    public String addDemand(String produceGuid) {
        String demandGuid = UUID.randomUUID().toString();
        demandMapper.insertDemand(produceGuid, demandGuid);

        //需要将默认的非功能节点存到数据库
        String[] titleStr = new String[]{"运行环境需求", "安全需求", "稳定性需求", "可靠性需求", "性能需求", "易用需求", "可扩展性需求", "可移植性需求", "可重用性需求"};
        ArrayList<Nodes> nodesList = new ArrayList<>();
        for (int i = 0; i < titleStr.length; i++) {
            String s = titleStr[i];
            Nodes nodes = new Nodes();
            nodes.setGuid(UUID.randomUUID().toString());
            nodes.setModuleGuid(demandGuid);
            nodes.setName(s);
            nodes.setClassType(DocumentTypeEnum.NO_FUNC_DEMAND.getCode());
            nodes.setNodeType(true);
            nodes.setNodeOrder(i);
            nodesList.add(nodes);
        }
        demandMapper.insertNodes(nodesList);
        //软件设计存库
        //概要设计
//        Outlinedesign outlinedesign = new Outlinedesign();
//        String outlinedesignGuid = UUID.randomUUID().toString();
//        outlinedesign.setGuid(outlinedesignGuid);
//        outlinedesign.setProduceGuid(produceGuid);
//        outlinedesign.setCreateTime(DateTool.parse(dateTimeUtil.getCurrDate(), "yyyy-MM-dd HH:mm:ss"));
//        outlinedesign.setObjective("");
//        outlinedesign.setStatus(1);
//        softwareDesignMapper.addOutlinedesign(outlinedesign);
//
//        //数据库
//        Dbdesign dbdesign = new Dbdesign();
//        String dbdesignGuid = UUID.randomUUID().toString();
//        dbdesign.setGuid(dbdesignGuid);
//        dbdesign.setProduceGuid(produceGuid);
//        dbdesign.setCreateTime(DateTool.parse(dateTimeUtil.getCurrDate(), "yyyy-MM-dd HH:mm:ss"));
//        dbdesign.setStatus(1);
//        dbDesignMapper.addDbDesign(dbdesign);
//
//        //接口
//        Interface inter = new Interface();
//        String interGuid = UUID.randomUUID().toString();
//        inter.setGuid(interGuid);
//        inter.setProduceGuid(produceGuid);
//        inter.setCreateTime(DateTool.parse(dateTimeUtil.getCurrDate(), "yyyy-MM-dd HH:mm:ss"));
//        inter.setStatus(1);
//        interfaceMapper.addInterface(inter);
        return demandGuid;
    }

    @Override
    public void updateDemand(Demandmanage demandmanage) {
        demandMapper.updateDemand(demandmanage);
    }

    @Override
    public List<Demandchangerecord> listDemandChangeRecord(String demandGuid) {
        return demandMapper.listDemandChangeRecord(demandGuid);
    }

    @Override
    public Demandmanage getDemand(String guid) {
        Demandmanage demandmanage = new Demandmanage();
        demandmanage.setGuid(guid);
        Demandmanage demand = demandMapper.getDemand(demandmanage);
        return demand != null ? demand : new Demandmanage();
    }

    @Override
    public List<Demandterm> listDemandTerm(String demandGuid) {
        return demandMapper.listDemandTerm(demandGuid);
    }

    @Override
    public void addOrEditDemandTerm(String demandTermList) {
        List<Demandterm> demandtermList = JSONArray.parseArray(demandTermList, Demandterm.class);
        Iterator<Demandterm> it = demandtermList.iterator();
        while (it.hasNext()) {
            Demandterm demandterm = it.next();
            if (demandterm.getGuid() == null || demandterm.getGuid().equals("")) {
                demandterm.setGuid(UUID.randomUUID().toString());
                demandMapper.insertDemandterm(demandterm);
            } else {
                demandMapper.updateDemandterm(demandterm);
            }
        }
    }

    @Override
    public void deleteDemandTerm(String guid) {
        demandMapper.deleteDemandTerm(guid);
    }

    @Override
    public List<Issuestobeconfirmed> listIssuesToBeConfirmed(String guid) {
        return demandMapper.listIssuesToBeConfirmed(guid);
    }

    @Override
    public void addOrEditIssuesToConfirm(String issuesToConfirmList) {
        List<Issuestobeconfirmed> issuestobeconfirmedList = JSONArray.parseArray(issuesToConfirmList, Issuestobeconfirmed.class);
        Iterator<Issuestobeconfirmed> it = issuestobeconfirmedList.iterator();
        while (it.hasNext()) {
            Issuestobeconfirmed issuestobeconfirmed = it.next();
            if (issuestobeconfirmed.getGuid() == null || issuestobeconfirmed.getGuid().equals("")) {
                issuestobeconfirmed.setGuid(UUID.randomUUID().toString());
                demandMapper.insertIssuestobeconfirmed(issuestobeconfirmed);
            } else {
                demandMapper.updateIssuestobeconfirmed(issuestobeconfirmed);
            }
        }
    }

    @Override
    public void deleteIssuesToBeConfirmed(String guid) {
        demandMapper.deleteIssuesToBeConfirmed(guid);
    }

    @Override
    public Detaileddesign getDetailDesign(String nodeGuid) {
        Detaileddesign detatilDesign = demandMapper.getDetatilDesign(nodeGuid);
        return detatilDesign != null ? detatilDesign : new Detaileddesign();
    }

    @Override
    public void addOrEditDetailDesign(Detaileddesign detaileddesign) {
        if (detaileddesign.getGuid().equals("")) {
            String uuid = UUID.randomUUID().toString();
            detaileddesign.setGuid(uuid);
            demandMapper.insertDetaileddesign(detaileddesign);
        } else {
            demandMapper.updateDetaileddesign(detaileddesign);
        }
    }

    @Override
    public void addOrEditDemandItem(DemandItem demanditem) {
        String guid = demanditem.getGuid();
        if (guid == null || "".equals(guid)) {
            String uuid = UUID.randomUUID().toString();
            demanditem.setGuid(uuid);
            demandMapper.insertDemandItem(demanditem);
        } else {
            demandMapper.updateDemandItem(demanditem);
        }
//        String[] demandTraceGuids = demanditem.getDemandTraceGuids();
//        String creatUserName = Base.getCreatUserName();
//        //表示需求变更进来的
//        if (demandTraceGuids != null && demandTraceGuids.length != 0) {
//            //首次变更
//            int count = demandMapper.countDemandTrcaeByNodeGuid(demanditem.getNodeGuid());
//            if (count != 0) {
//                return;
//            }
//            //变更记录入库
//            Demandchangerecord demandchangerecord = new Demandchangerecord();
//            demandchangerecord.setChangeName(creatUserName);
//            demandchangerecord.setDemandGuid(demanditem.getDemandGuid());
//            demandchangerecord.setGuid(UUID.randomUUID().toString());
//            demandchangerecord.setNodeGuid(demanditem.getNodeGuid());
//            addDemandChangeRecord(demandchangerecord);
//            //将需求变更为需求变更
//            demandMapper.updateDealState(demanditem.getNodeGuid(), DemandItemDealStateEnum.CONFIRMED.getCode());
//        }
//        if (demandTraceGuids != null) {
//            demandMapper.clearNodeGuid(demandTraceGuids, demanditem.getNodeGuid());
//            demandMapper.updateNodeGuid(demandTraceGuids, demanditem.getNodeGuid(), creatUserName);
//        }


//        //查询有关的项目组成员
//        ArrayList<Integer> typeList = new ArrayList<>();
//        typeList.add(TeamResourceEnum.RD_GROUP.getCode());
//        String produceGuid = demanditem.getProduceGuid();
//        Producemanage queryProducemanage = new Producemanage();
//        queryProducemanage.setGuid(produceGuid);
//        Producemanage producemanage = producemanageMapper.getProduce(queryProducemanage);
//        String contentDescription = producemanage.getName() + "开发待确认";
//        List<Producemember> producememberList = producemanageMapper.listProduceMemberByType(produceGuid, typeList);
//        if (producememberList.size() == 0) {
//            return;
//        }
//        String[] managerGuids = producememberList.stream().map(Producemember::getManagerGuid).toArray(String[]::new);
//        //消息存库
//        alertService.saveMessage(producemanage, contentDescription, managerGuids, MessageTypeEnum.DEV_WAIT_CONFIRM.getCode());
    }

    @Override
    public void addDemandChangeRecord(Demandchangerecord demandchangerecord) {
        demandchangerecord.setGuid(UUID.randomUUID().toString());
        demandMapper.addDemandChangeRecord(demandchangerecord);
    }

    @Override
    public List<Nodes> listNodesByProject(String projectGuid) {
        return demandMapper.listNodesByProject(projectGuid);
    }

    @Override
    public void addNodes(Nodes nodes) {
        nodes.setGuid(UUID.randomUUID().toString());
        demandMapper.addNodes(nodes);
    }

    @Override
    public void editNodes(String guid, String nodeName) {
        demandMapper.updateNotes(guid, nodeName);

    }

    @Override
    public void deleteNodes(String guid) {
        demandMapper.deleteNodeByGuid(guid);
    }

    private void sendMessage(Demandtrace demandtrace) {
        int dealState = demandtrace.getDealState() == null ? 0 : demandtrace.getDealState();
        ArrayList<Integer> typeList = new ArrayList<>();
        int alertType = 0;
        if (dealState == DemandTraceDealStateEnum.REPEAL.getCode()) {
            //查询有关的项目组成员
            typeList.add(TeamResourceEnum.DEMAND_GROUP.getCode());
            alertType = MessageTypeEnum.DEMADN_VOID.getCode();
        } else if (dealState == DemandTraceDealStateEnum.HUNG_UP.getCode()) {
            //查询有关的项目组成员
            typeList.add(TeamResourceEnum.DEMAND_GROUP.getCode());
            alertType = MessageTypeEnum.DEMAND_HUNG.getCode();
        } else if (dealState == DemandTraceDealStateEnum.WORKING.getCode()) {
            //查询有关的项目组成员
            typeList.add(TeamResourceEnum.DEMAND_GROUP.getCode());
            alertType = MessageTypeEnum.DEMAND_WAIT_DEIT.getCode();
        }
        if (typeList.size() == 0) {
            return;
        }
        String produceGuid = demandtrace.getProduceGuid();
        Producemanage queryProducemanage = new Producemanage();
        queryProducemanage.setGuid(produceGuid);
        Producemanage producemanage = producemanageMapper.getProduce(queryProducemanage);
        List<Producemember> producememberList = producemanageMapper.listProduceMemberByType(produceGuid, typeList);
        if (producememberList.size() == 0) {
            return;
        }
        String[] managerGuids = producememberList.stream().map(Producemember::getManagerGuid).toArray(String[]::new);
        //消息存库
        alertService.saveMessage(producemanage, demandtrace.getDemandDescription(), managerGuids, alertType);
    }

    private HashMap<String, DemandTraceCountVo> getDemandTraceCountVoHashMap(List<Demandtrace> allDemandtraceList) {
        HashMap<String, DemandTraceCountVo> demandTraceCountVoHashMap = new HashMap<>();
        for (Demandtrace demandtrace : allDemandtraceList) {
            String produceGuid = demandtrace.getProduceGuid();
            DemandTraceCountVo demandTraceCountVo = demandTraceCountVoHashMap.get(produceGuid);
            if (demandTraceCountVo == null) {
                demandTraceCountVo = new DemandTraceCountVo();
            }
            demandTraceCountVo.setTotalCount(demandTraceCountVo.getTotalCount() + 1);
            if (demandtrace.getDealState() == 3) {
                demandTraceCountVo.setHangCount(demandTraceCountVo.getHangCount() + 1);
            }
            if (demandtrace.getDealState() == 5) {
                demandTraceCountVo.setVoidCount(demandTraceCountVo.getVoidCount() + 1);
            }
            if (demandtrace.getDealState() == 6) {
                demandTraceCountVo.setSuspendCount(demandTraceCountVo.getSuspendCount() + 1);
            }

            if (demandtrace.getTechManager().equals("")) {
                demandTraceCountVo.setWaitConfirmCount(demandTraceCountVo.getWaitConfirmCount());
            }
            if (demandtrace.getDealState() == 2 && demandtrace.getTechManager().equals("")) {
                demandTraceCountVo.setWaitEditCount(demandTraceCountVo.getWaitEditCount() + 1);
            }
            if (demandtrace.getReviewFlag() == 1 && demandtrace.getReviewName().equals("")) {
                demandTraceCountVo.setWaitReviewCount(demandTraceCountVo.getWaitReviewCount() + 1);
            }
            if (!demandtrace.getReviewName().equals("") && demandtrace.getDevelopName().equals("")) {
                demandTraceCountVo.setWaitDevelopConfirmCount(demandTraceCountVo.getWaitDemandConfirmCount() + 1);
            }
            if (demandtrace.getDevlopFinishName().equals("") && !demandtrace.getDevelopName().equals("")) {
                demandTraceCountVo.setWaitDevelopFinishCount(demandTraceCountVo.getWaitDemandConfirmCount() + 1);
            }
            if (!demandtrace.getDevlopFinishName().equals("") && demandtrace.getDemandConfirmName().equals("")) {
                demandTraceCountVo.setWaitDemandConfirmCount(demandTraceCountVo.getWaitDemandConfirmCount() + 1);
            }
            if (demandtrace.getCheckName().equals("") && !demandtrace.getDemandConfirmName().equals("")) {
                demandTraceCountVo.setWaitCheckCount(demandTraceCountVo.getWaitDemandConfirmCount() + 1);
            }
            if (!demandtrace.getCheckName().equals("")) {
                demandTraceCountVo.setFinishCount(demandTraceCountVo.getWaitDemandConfirmCount() + 1);
            }
            demandTraceCountVoHashMap.put(produceGuid, demandTraceCountVo);
        }
        return demandTraceCountVoHashMap;
    }
}
