package com.example.fastboot.server.producems.mapper;

import com.example.fastboot.server.producems.model.Checkchangnotes;
import com.example.fastboot.server.producems.model.Checkfeedback;
import com.example.fastboot.server.producems.model.Producemanage;
import com.example.fastboot.server.producems.vo.SoftCheckStateCountVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author bo
 * @Date 2024 10 17 17 06
 **/
@Mapper
@Repository
public interface CheckfeedbackMapper {
    /**
     * 获取去重后的产品唯一标识
     *
     * @return
     */
    List<String> listDistinctProduceGuid();

    /**
     * 获取不同状态的软件测试
     *
     * @return
     */
    List<SoftCheckStateCountVo> countCheckFeedbackByProduce(String produceGuid);

    /**
     * 获取软件测试，根据用户锁定关系排序
     *
     * @param producemanage
     * @param produceGuids
     * @return
     */
    List<Checkfeedback> listSoftCheckByProduce(@Param("producemanage") Producemanage producemanage, @Param("produceGuids") String[] produceGuids);

    /**
     * 新增软件测试
     *
     * @param checkfeedback
     */
    void insertCheckfeedback(Checkfeedback checkfeedback);

    /**
     * 获取软件测试列表
     *
     * @param checkfeedback
     * @return
     */
    List<Checkfeedback> listCheckFeedback(Checkfeedback checkfeedback);

    /**
     * 获取变更项请
     *
     * @param guid
     * @return
     */
    Checkchangnotes getCheckChangeNotes(String guid);

    /**
     * 新增测试变更记录
     *
     * @param checkchangnotes
     */
    void addCheckchangnotes(Checkchangnotes checkchangnotes);

    /**
     * 更新变更说明
     *
     * @param checkchangnotes
     */
    void updateCheckchangnotes(Checkchangnotes checkchangnotes);

    /**
     * 删除软件测试
     *
     * @param guid
     */
    void deleteCheckFeedback(String guid);

    /**
     * 更新软件测试
     */
    void updateCheckfeedback(@Param("checkfeedback") Checkfeedback checkfeedback);

}
