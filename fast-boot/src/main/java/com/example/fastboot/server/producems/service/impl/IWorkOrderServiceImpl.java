package com.example.fastboot.server.producems.service.impl;

import com.example.fastboot.server.producems.mapper.WorkOrderMapper;
import com.example.fastboot.server.producems.model.Reviewrelationship;
import com.example.fastboot.server.producems.model.Workordercategory;
import com.example.fastboot.server.producems.model.Workorderitem;
import com.example.fastboot.server.producems.model.Workordertype;
import com.example.fastboot.server.producems.service.IWorkOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

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
    public void updateWorkOrderItemderItem(String name, String guid) {
        workOrderMapper.updateWorkOrderItemderItem(name, guid);
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
}
