package com.example.fastboot.server.producems.service;

import com.example.fastboot.common.response.PageResponse;
import com.example.fastboot.server.producems.model.Producemanage;
import com.github.pagehelper.PageInfo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @Author bo
 * @Date 2024 10 18 09 04
 **/

public interface ISoftwareCheckService {

    /**
     * 获取软件测试列表数量
     *
     * @param producemanage
     * @return
     */
    PageResponse countCheckFeedbackByProduce(Producemanage producemanage);

    /**
     * 关联产品
     * @param produceGuid
     */
    void relatedProduce(String produceGuid);
}
