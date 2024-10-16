package com.example.fastboot.server.producems.service.impl;

import com.alibaba.fastjson2.JSONArray;
import com.example.fastboot.common.enums.TeamResourceEnum;
import com.example.fastboot.common.exception.ServiceException;
import com.example.fastboot.common.response.PageResponse;
import com.example.fastboot.common.security.LoginUser;
import com.example.fastboot.server.producems.mapper.ProducemanageMapper;
import com.example.fastboot.server.producems.mapper.ProjectMapper;
import com.example.fastboot.server.producems.model.LockProduceToUser;
import com.example.fastboot.server.producems.model.Producemanage;
import com.example.fastboot.server.producems.model.Producemember;
import com.example.fastboot.server.producems.service.IProduceService;
import com.example.fastboot.server.sys.controller.Base;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * @Author bo
 * @Date 2024 10 15 11 37
 **/
@Service
@Transactional
public class IProduceServiceImpl implements IProduceService {

    @Autowired
    private ProducemanageMapper producemanageMapper;
    @Autowired
    private ProjectMapper projectMapper;

    @Override
    public PageResponse listProduce(Producemanage producemanage) {
        LoginUser loginUser = (LoginUser) Base.getCreatUserDetails();
        //获取用户锁定产品
        List<LockProduceToUser> lockProduceToUserList = producemanageMapper.listLockProduceToUserByUser(loginUser.getUserGuid());
        //获取list的produceGuid属性的值生成新的数组
        String[] produceGuids = lockProduceToUserList.stream().map(LockProduceToUser::getProduceGuid).toArray(String[]::new);
        PageHelper.startPage(producemanage.getCurrentPage(), producemanage.getPageSize());
        List<Producemanage> producemanageList = producemanageMapper.listProduce(producemanage, produceGuids);

        for (Producemanage item : producemanageList) {
            //获取项目数量
            int count = projectMapper.countByProduceGuid(item.getGuid());
            item.setCount(count);
            item.setLockProduceGuids(produceGuids);
            //获取资源分类
            List<Producemember> producememberList = producemanageMapper.listProduceMember(item.getGuid());
            for (Producemember producemember : producememberList) {
                Integer teamResource = producemember.getTeamResource();
                if (teamResource == TeamResourceEnum.DEMAND_GROUP.getCode()) {
                    item.setDemandManagerName(producemember.getManagerName());
                } else if (teamResource == TeamResourceEnum.RD_GROUP.getCode()) {
                    item.setDevManagerName(producemember.getManagerName());
                } else if (teamResource == TeamResourceEnum.TEST_GROUP.getCode()) {
                    item.setCheckManagerName(producemember.getManagerName());
                }
            }

        }
        PageInfo<Producemanage> producemanagePageInfo = new PageInfo<>(producemanageList);
        return new PageResponse<>(producemanagePageInfo);
    }

    @Override
    public void deleteProduce(String guid) {
        producemanageMapper.deleteProduceByGuid(guid);
        producemanageMapper.deleteLockProduceToUserByProduce(guid);
    }

    @Override
    public List<Producemember> listProduceMemList(String guid) {
        return producemanageMapper.listProduceMember(guid);
    }

    @Override
    public void addProduce(Producemanage producemanage) {
        List<Producemember> producememberList = JSONArray.parseArray(producemanage.getTeamReasourcesList(), Producemember.class);
        String guid = producemanage.getGuid();
        if (guid == null || "".equals(guid)) {
            //检验产品名和产品编号是否唯一
            Producemanage checkNameProduce = new Producemanage();
            checkNameProduce.setName(producemanage.getName());
            Producemanage checkNumberProduce = new Producemanage();
            checkNumberProduce.setNumber(producemanage.getNumber());
            if (producemanageMapper.getProduce(checkNameProduce) != null) {
                throw new ServiceException("产品名称重复");
            } else if (producemanageMapper.getProduce(checkNumberProduce) != null) {
                throw new ServiceException("产品编号重复");
            }
            String createGuid = UUID.randomUUID().toString();
            producemanage.setCreateTime(new Date());
            producemanage.setGuid(createGuid);
            producemanageMapper.addProduce(producemanage);
            if (producememberList != null && producememberList.size() != 0) {
                producemanageMapper.addProduceMember(createGuid, producememberList);
            }

        } else {
            producemanageMapper.updateProduce(producemanage);
            if (producememberList != null) {
                for (Producemember producemember : producememberList) {
                    producemanageMapper.updateProduceMember(guid, producemember);
                }
            }
        }
    }

    @Override
    public void updateLockProduceToUser(String[] produceGuids) {
        //删除关联产品列表
        String creatUserGuid = Base.getCreatUserGuid();
        producemanageMapper.deleteLockProduceToUserByUser(creatUserGuid);
        if (produceGuids.length != 0) {
            producemanageMapper.insertLockProduceToUser(creatUserGuid, produceGuids);
        }
    }

    @Override
    public List<Producemanage> listAllProduce() {
        return producemanageMapper.listAllProduce();
    }
}
