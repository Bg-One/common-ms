package com.example.fastboot.server.producems.mapper;

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
     * @param checkfeedback
     */
    void insertCheckfeedback( Checkfeedback checkfeedback);
}
