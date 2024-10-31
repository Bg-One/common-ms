package com.example.fastboot.server.producems.service.impl;

import cn.hutool.core.util.NumberUtil;
import com.example.fastboot.common.enums.WorkOrderStatusEnum;
import com.example.fastboot.common.exception.ServiceException;
import com.example.fastboot.server.producems.mapper.WorkOrderMapper;
import com.example.fastboot.server.producems.model.*;
import com.example.fastboot.server.producems.service.IWorkOrderService;
import com.example.fastboot.server.producems.vo.WorkDurationVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @Author bo
 * @Date 2024 10 27 23 56
 **/
@Service
@Transactional
public class IWorkOrderServiceImpl implements IWorkOrderService {

    @Autowired
    private WorkOrderMapper workOrderMapper;

    @Override
    public List<Workordertype> listWorkOrderType() {
        return workOrderMapper.listWorkOrderType();
    }

    @Override
    public void updateWorkOrderType(String name, String guid) {
        workOrderMapper.updateWorkOrderType(name, guid);
    }

    @Override
    public void deleteWorkOrderType(String guid) {
        workOrderMapper.deleteWorkOrderType(guid);
    }

    @Override
    public void createWorkOrderType(Workordertype workordertype) {
        workordertype.setGuid(UUID.randomUUID().toString());
        workOrderMapper.createWorkOrderType(workordertype);
    }

    @Override
    public List<Workordercategory> listWorkOrderCategory(Workordercategory workordercategory) {
        return workOrderMapper.listWorkOrderCategory(workordercategory);
    }

    @Override
    public void updateWorkOrderCategory(String name, String guid) {
        workOrderMapper.updateWorkOrderCategory(name, guid);
    }

    @Override
    public void deleteWorkOrderCategory(String guid) {
        workOrderMapper.deleteWorkOrderCategory(guid);
    }

    @Override
    public void createWorkOrderCategory(Workordercategory workordercategory) {
        workordercategory.setGuid(UUID.randomUUID().toString());
        workOrderMapper.createWorkOrderCategory(workordercategory);
    }

    @Override
    public List<Workorderitem> listWorkOrderItem(Workorderitem workorderitem) {
        return workOrderMapper.listWorkOrderItem(workorderitem);
    }

    @Override
    public void updateWorkOrderItem(String name, String guid) {
        workOrderMapper.updateWorkOrderItem(name, guid);
    }

    @Override
    public void deleteWorkOrderItem(String guid) {
        workOrderMapper.deleteWorkOrderItem(guid);
    }

    @Override
    public void createWorkOrderItem(Workorderitem workorderitem) {
        workorderitem.setGuid(UUID.randomUUID().toString());
        workOrderMapper.createWorkOrderItem(workorderitem);
    }

    @Override
    public List<Reviewrelationship> listReviewRelationship() {
        return workOrderMapper.listReviewRelationship();
    }

    @Override
    public void saveReviewRelationship(List<Reviewrelationship> reviewrelationshipList) {
        for (Reviewrelationship reviewrelationship : reviewrelationshipList) {
            String reviewGuid = workOrderMapper.getReviewGuid(reviewrelationship.getUserGuid());
            if (reviewGuid == null || reviewGuid.equals("")) {
                workOrderMapper.insertReviewRelationship(reviewrelationship);
            } else {
                workOrderMapper.updateReviewRelationship(reviewrelationship);
            }
        }
    }

    @Override
    public List<Workorder> statisticProjectWorkDuration(WorkDurationVo workDurationVo) {
        List<Workorder> workorderList = workOrderMapper.listWorkOrderForWorkDuration(workDurationVo);
        //按项目分组
        Map<String, List<Workorder>> workOrderMap = workorderList.stream()
                .collect(Collectors.groupingBy(Workorder::getProjectGuid));
        Set<String> projectGuidSet = workOrderMap.keySet();
        double projectDurationSum = 0;
        for (String projectGuid : projectGuidSet) {
            //项目总工时
            List<Workorder> workorderByProjectList = workOrderMap.get(projectGuid);
            double projectDuration = workorderByProjectList.stream().mapToDouble(Workorder::getWorkDuration).sum();
            projectDurationSum += projectDuration;
            for (Workorder workorder : workorderByProjectList) {
                workorder.setProjectWorkDuration(projectDuration);
            }
            //按员工分组
            Map<String, List<Workorder>> workOrderByUserMap = workorderByProjectList.stream()
                    .collect(Collectors.groupingBy(Workorder::getCreateGuid));
            Set<String> userGuidSet = workOrderByUserMap.keySet();
            for (String userGuid : userGuidSet) {
                List<Workorder> workorderByUserList = workOrderByUserMap.get(userGuid);
                double userDuration = workorderByUserList.stream().mapToDouble(Workorder::getWorkDuration).sum();
                for (Workorder workorder : workorderByUserList) {
                    workorder.setAllWorkDuration(userDuration);
                }
                //按项目部的工作类型分组
                Map<String, List<Workorder>> workOrderByTypeMap = workorderByUserList.stream()
                        .collect(Collectors.groupingBy(Workorder::getProjectDepWorkType));
                Set<String> typeNameSet = workOrderByTypeMap.keySet();
                for (String s : typeNameSet) {
                    List<Workorder> typeList = workOrderByTypeMap.get(s);
                    double typeDuration = typeList.stream().mapToDouble(Workorder::getWorkDuration).sum();
                    for (Workorder workorder : typeList) {
                        workorder.setProjectDepWorkDuration(typeDuration);
                    }
                }
            }
        }
        //统计占比
        for (Workorder workorder : workorderList) {
            int i = NumberUtil.div(workorder.getProjectWorkDuration() + "", projectDurationSum + "", 2).multiply(BigDecimal.valueOf(100)).intValue();
            workorder.setProportion(i + "%");
        }
        return workorderList;
    }

    @Override
    public List<Workorder> statisticUserWorkDuration(WorkDurationVo workDurationVo) {
        List<Workorder> workorderList = workOrderMapper.listWorkOrderForWorkDuration(workDurationVo);
        //按人员分组
        Map<String, List<Workorder>> workOrderByUserMap = workorderList.stream()
                .collect(Collectors.groupingBy(Workorder::getCreateGuid));
        Set<String> userGuidSet = workOrderByUserMap.keySet();
        ArrayList<Workorder> mergeWorkList = new ArrayList<>();
        for (String userGuid : userGuidSet) {
            List<Workorder> workorderByUserList = workOrderByUserMap.get(userGuid);
            List<Workorder> mergeList = merge(workorderByUserList);
            double sum = mergeList.stream().mapToDouble(Workorder::getProjectWorkDuration).sum();
            mergeList.forEach(item -> item.setAllWorkDuration(sum));
            mergeWorkList.addAll(mergeList);
        }
        return mergeWorkList;
    }

    @Override
    public List<Workorder> listWorkOrder(Workorder workorder) {
        List<Workorder> workorderList = workOrderMapper.listWorkOrder(workorder);
        List<EngineeringWorkType> engineeringWorkTypeList = workOrderMapper.listProjectDepworkType();
        for (Workorder workOrderItem : workorderList) {
            if (!workOrderItem.getProjectDepWorkType().equals("")) {
                List<EngineeringWorkType> collect = engineeringWorkTypeList.stream().filter(item -> item.getName().equals(workorder.getProjectDepWorkType())).collect(Collectors.toList());
                workOrderItem.setProjectDepworkTypeId(collect.size() > 0 ? collect.get(0).getId() : null);
            } else {
                workOrderItem.setProjectDepworkTypeId(null);
            }
        }
        return workorderList;
    }

    @Override
    public void deleteWorkOrder(String guid) {
        workOrderMapper.deleteWorkOrder(guid);
    }

    @Override
    public List<Workorder> getWorkOrder(String createGuid, String createTime) {
        List<Workorder> workorderList = workOrderMapper.listWorkOrderByCreateParam(createGuid, createTime);
        List<EngineeringWorkType> engineeringWorkTypeList = workOrderMapper.listProjectDepworkType();
        for (Workorder workorder : workorderList) {
            if (!workorder.getProjectDepWorkType().equals("")) {
                List<EngineeringWorkType> collect = engineeringWorkTypeList.stream().filter(item -> item.getName().equals(workorder.getProjectDepWorkType())).collect(Collectors.toList());
                workorder.setProjectDepworkTypeId(collect.get(0).getId());
            } else {
                workorder.setProjectDepworkTypeId(null);
            }
        }
        return workorderList;
    }

    @Override
    public List<EngineeringWorkType> listProjectDepworkType() {
        return workOrderMapper.listProjectDepworkType();
    }

    @Override
    public void updateWorkOrderStatus(Workorder workorder) {
        String guids = workorder.getGuids();
        Integer status = workorder.getStatus();
        List<String> guidList = Arrays.asList(guids.split(","));
        List<Workorder> workOrderList = workOrderMapper.listWorkOrderByGuidList(guidList);
        List<Workorder> collect = workOrderList.stream().filter(item -> !item.getStatus().equals(WorkOrderStatusEnum.WAIT_CHECHED.getCode())).collect(Collectors.toList());
        if (status != WorkOrderStatusEnum.WAIT_CHECHED.getCode() &&
                ((collect.size() != 0 && !workOrderList.get(0).getStatus().equals(WorkOrderStatusEnum.CHECHED.getCode())) || guidList.size() != workOrderList.size())) {
            throw new ServiceException("报单状态发生变更，请刷新重试");
        }
        //当guids存在时，可以直接使用guids中的值，更新状态无需再使用create相关的字段处理
        for (String guid : guidList) {
            workorder.setGuid(guid);
            workOrderMapper.updateWorkOrderStatus(workorder);
        }
        //todo:通知工单审核失败
        String reason = workorder.getReason();
        if (!reason.equals("")) {

        }
//        WebSocket.countWorkOrderStatus();
    }

    /**
     * 某一属性相同的工时合并
     */
    public static List<Workorder> merge(List<Workorder> list) {
        Map<String, Workorder> map = new HashMap<>();
        list.forEach(workorder -> {
            Workorder last = map.get(workorder.getProjectGuid());
            if (null != last) {
                workorder.setProjectWorkDuration(workorder.getWorkDuration() + last.getProjectWorkDuration());
                map.put(workorder.getProjectGuid(), workorder);
            } else {
                workorder.setProjectWorkDuration(workorder.getWorkDuration());
                map.put(workorder.getProjectGuid(), workorder);
            }
        });
        return new ArrayList<>(map.values());
    }
}
