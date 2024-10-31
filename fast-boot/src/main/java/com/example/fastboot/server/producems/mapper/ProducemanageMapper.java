package com.example.fastboot.server.producems.mapper;


import com.example.fastboot.server.producems.model.Demandmanage;
import com.example.fastboot.server.producems.model.LockProduceToUser;
import com.example.fastboot.server.producems.model.Producemanage;
import com.example.fastboot.server.producems.model.Producemember;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;


/**
 * @author liuzhaobo
 * @description 针对表【producemanage】的数据库操作Mapper
 * @createDate 2024-03-08 13:25:18
 * @Entity com.truetech.producems.model.Producemanage
 */
@Mapper
@Repository
public interface ProducemanageMapper {


    /**
     * 获取全部产品
     *
     * @param producemanage
     */
    List<Producemanage> listProduce(@Param("producemanage") Producemanage producemanage, @Param("produceGuids") String[] produceGuids);

    /**
     * 根据产品获取产品团队资源
     *
     * @param produceGuid
     * @return
     */
    List<Producemember> listProduceMember(String produceGuid);

    /**
     * 根据产品唯一标识删除产品
     *
     * @param guid
     */
    void deleteProduceByGuid(String guid);

    /**
     * 新增产品
     *
     * @param producemanage
     */
    void addProduce(Producemanage producemanage);

    /**
     * 更新产品信息
     *
     * @param producemanage
     */
    void updateProduce(Producemanage producemanage);

    /**
     * 新增产品资源分配
     *
     * @param produceManageGuid
     * @param producememberList
     */
    void addProduceMember(@Param("produceManageGuid") String produceManageGuid, @Param("producememberList") List<Producemember> producememberList);

    /**
     * 更新产品资源
     *
     * @param guid
     * @param producemember
     */
    void updateProduceMember(@Param("guid") String guid, @Param("producemember") Producemember producemember);

    /**
     * 获取产品
     *
     * @param producemanage
     * @return
     */
    Producemanage getProduce(Producemanage producemanage);

    /**
     * 获取用户锁定产品
     *
     * @param userGuid
     * @param produceGuid
     * @return
     */
    LockProduceToUser getProduceLockToUser(@Param("userGuid") String userGuid, @Param("produceGuid") String produceGuid);

    /**
     * 删除关联关系
     */
    void deleteLockProduceToUserByUser(String userGuid);

    /**
     * 删除关联关系
     */
    void deleteLockProduceToUserByProduce(String produceGuid);

    /**
     * 新增关联关系
     *
     * @param creatUserGuid
     * @param produceGuids
     */
    void insertLockProduceToUser(@Param("userGuid") String creatUserGuid, @Param("produceGuids") String[] produceGuids);

    /**
     * 根据用户获取产品锁定列表
     *
     * @param userGuid
     * @return
     */
    List<LockProduceToUser> listLockProduceToUserByUser(String userGuid);

    /**
     * 获取全部产品
     *
     * @return
     */
    List<Producemanage> listAllProduce();

    /**
     * 获取产品组成员
     *
     * @param produceGuid
     * @param teamResourceList
     * @return
     */
    List<Producemember> listProduceMemberByType(@Param("produceGuid") String produceGuid, @Param("teamResourceList") ArrayList<Integer> teamResourceList);

    /**
     * 获取未绑定软件审核的产品
     *
     * @param produceGuidList
     * @return
     */
    List<Producemanage> listCheckProduceListByNotInProduceGuid(List<String> produceGuidList);

    /**
     * 根据产品唯一标识获取产品列表
     *
     * @param producemanage
     * @param produceGuids
     * @return
     */
    List<Producemanage> listProduceByInProduceGuid(@Param("producemanage") Producemanage producemanage, @Param("produceGuids") String[] produceGuids);

    /**
     * 删除锁定产品的关联关系
     *
     * @param creatUserGuid
     * @param deleteBindProduceGuids
     */
    void deleteLockProduceToUser(@Param("creatUserGuid") String creatUserGuid, @Param("deleteBindProduceGuids") String[] deleteBindProduceGuids);

    /**
     * 获取出厂验收列表
     *
     * @param producemanage
     * @param produceGuids
     * @return
     */
    List<Producemanage> listAppearanceAccept(@Param("producemanage") Producemanage producemanage, @Param("produceGuids") String[] produceGuids);

    /**
     * 出厂/取消出厂
     *
     * @param producemanage
     */
    void appearanceAccept(Producemanage producemanage);

    /**
     * 获取需求列表
     *
     * @param demandmanage
     * @param produceGuids
     * @return
     */
    List<Demandmanage> listDemand(@Param("demandmanage") Demandmanage demandmanage, @Param("produceGuids") String[] produceGuids);

    /**
     * 根据产品唯一标识和资源id获取息辕信息
     * @param produceGuid
     * @param teamResource
     * @return
     */
    Producemember getProduceMemberByType(@Param("produceGuid") String produceGuid,@Param("teamResource") int teamResource);

    /**
     * 获取用户关联的产品列表
     * @param creatUserGuid
     * @return
     */
    List<String> listProduceGuidByUserGuid(String creatUserGuid);
}




