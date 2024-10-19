package com.example.fastboot.server.producems.service.impl;

import com.example.fastboot.common.enums.SoftCheckEnum;
import com.example.fastboot.common.response.PageResponse;
import com.example.fastboot.common.security.LoginUser;
import com.example.fastboot.server.producems.mapper.CheckfeedbackMapper;
import com.example.fastboot.server.producems.mapper.ProducemanageMapper;
import com.example.fastboot.server.producems.model.Checkfeedback;
import com.example.fastboot.server.producems.model.LockProduceToUser;
import com.example.fastboot.server.producems.model.Producemanage;
import com.example.fastboot.server.producems.service.ISoftwareCheckService;
import com.example.fastboot.server.producems.vo.CheckFeedbackCountVo;
import com.example.fastboot.server.producems.vo.SoftCheckStateCountVo;
import com.example.fastboot.server.sys.controller.Base;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * @Author bo
 * @Date 2024 10 18 09 04
 **/
@Service
@Transactional
public class ISoftwareCheckServiceImpl implements ISoftwareCheckService {
    @Autowired
    private ProducemanageMapper producemanageMapper;
    @Autowired
    private CheckfeedbackMapper checkfeedbackMapper;

    @Override
    public PageResponse countCheckFeedbackByProduce(Producemanage producemanage) {
        LoginUser loginUser = (LoginUser) Base.getCreatUserDetails();
        //获取用户锁定产品
        List<LockProduceToUser> lockProduceToUserList = producemanageMapper.listLockProduceToUserByUser(loginUser.getUserGuid());
        //获取list的produceGuid属性的值生成新的数组
        String[] produceGuids = lockProduceToUserList.stream().map(LockProduceToUser::getProduceGuid).toArray(String[]::new);
        PageHelper.startPage(producemanage.getCurrentPage(), producemanage.getPageSize());
        List<Checkfeedback> checkfeedbackList = checkfeedbackMapper.listSoftCheckByProduce(producemanage, produceGuids);

        for (Checkfeedback item : checkfeedbackList) {
            CheckFeedbackCountVo checkFeedbackCountVo = new CheckFeedbackCountVo();
            Producemanage queryProduceManage = new Producemanage();
            queryProduceManage.setGuid(item.getProduceGuid());
            item.setProduceName(producemanageMapper.getProduce(queryProduceManage).getName());
            List<SoftCheckStateCountVo> softCheckStateCountVoList = checkfeedbackMapper.countCheckFeedbackByProduce(item.getGuid());
            int allCount = 0;
            for (SoftCheckStateCountVo softCheckStateCountVo : softCheckStateCountVoList) {
                allCount += softCheckStateCountVo.getCount();
                int softCheckState = softCheckStateCountVo.getSoftCheckState();
                if (SoftCheckEnum.ADD.getCode() == softCheckState) {
                    checkFeedbackCountVo.setCheckWaitConfirmCount(softCheckStateCountVo.getCount());
                } else if (SoftCheckEnum.PASS.getCode() == softCheckState) {
                    checkFeedbackCountVo.setDevWaitConfirmCount(softCheckStateCountVo.getCount());
                } else if (SoftCheckEnum.NO_PASS.getCode() == softCheckState) {
                    checkFeedbackCountVo.setRevisingCount(softCheckStateCountVo.getCount());
                } else if (SoftCheckEnum.OPEN.getCode() == softCheckState) {
                    checkFeedbackCountVo.setWaitRetestCount(softCheckStateCountVo.getCount());
                } else if (SoftCheckEnum.HUNGUP.getCode() == softCheckState) {
                    checkFeedbackCountVo.setNoPassedCount(softCheckStateCountVo.getCount());
                } else if (SoftCheckEnum.CLOSEE.getCode() == softCheckState) {
                    checkFeedbackCountVo.setPassedCount(softCheckStateCountVo.getCount());
                } else if (SoftCheckEnum.DEV_FINISH.getCode() == softCheckState) {
                    checkFeedbackCountVo.setReopenCount(softCheckStateCountVo.getCount());
                }
            }
            checkFeedbackCountVo.setTotalCount(allCount);
            item.setCheckFeedbackCountVo(checkFeedbackCountVo);
        }

        PageInfo<Checkfeedback> checkfeedbackPageInfo = new PageInfo<>(checkfeedbackList);
        return new PageResponse<>(checkfeedbackPageInfo);
    }

    @Override
    public void relatedProduce(String produceGuid) {
        Checkfeedback checkfeedback = new Checkfeedback();
        checkfeedback.setGuid(UUID.randomUUID().toString());
        checkfeedback.setProduceGuid(produceGuid);
        checkfeedbackMapper.insertCheckfeedback(checkfeedback);
    }

    @Override
    public PageResponse listCheckFeedback(Checkfeedback checkfeedback) {
        PageHelper.startPage(checkfeedback.getCurrentPage(), checkfeedback.getPageSize());
        List<Checkfeedback> checkfeedbacks = checkfeedbackMapper.listCheckFeedback(checkfeedback);
        PageInfo<Checkfeedback> checkfeedbackPageInfo = new PageInfo<>(checkfeedbacks);
        return new PageResponse<>(checkfeedbackPageInfo);
    }
}
