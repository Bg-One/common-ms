package com.example.fastboot.server.producems.service;

import com.example.fastboot.common.response.PageResponse;
import com.example.fastboot.server.producems.model.Checkchangnotes;
import com.example.fastboot.server.producems.model.Checkfeedback;
import com.example.fastboot.server.producems.model.Producemanage;

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
     *
     * @param produceGuid
     */
    void relatedProduce(String produceGuid);

    /**
     * @param checkfeedback
     * @return
     */
    PageResponse listCheckFeedback(Checkfeedback checkfeedback);

    /**
     * 新增测试反馈
     * @param checkFeedbackList
     */
    void editCheckfeedback(String checkFeedbackList);

    /**
     *
     * @param checkchangnotes
     * @return
     */
    void addOrEditCheckChangNote(Checkchangnotes checkchangnotes);

    /**
     * 获取变更记录
     * @param guid
     * @return
     */
    Checkchangnotes getCheckChangeNotes(String guid);

    /**
     * 删除软件测试
     * @param guid
     */
    void deleteCheckFeedback(String guid);

    /**
     * 新增测试反馈
     * @param checkfeedback
     */
    void addCheckfeedback(Checkfeedback checkfeedback);
}
