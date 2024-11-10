package com.example.fastboot.server.producems.mapper;

import com.example.fastboot.server.producems.model.WeeklyReport;
import com.example.fastboot.server.producems.model.WeeklyReportDetail;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author bo
 * @Date 2024 11 07 14 16
 **/
@Mapper
@Repository
public interface WeeklyReportMapper {

    /**
     * 获取工作集
     * @param weeklyReport
     * @return
     */
    List<WeeklyReport> listWeeklyReporterSet(WeeklyReport weeklyReport);

    /**
     * 获取工作集详情
     * @param guid
     * @return
     */
    WeeklyReport getWeeklyReporterSetDetail(String guid);

    /**
     * 新增工作集
     * @param weeklyReport
     */
    void addWeeklyReport(WeeklyReport weeklyReport);

    /**
     * 删除工作集
     * @param guid
     */
    void delWeeklyReport(String guid);

    /**
     * 删除工作集详情
     * @param weeklyReportGuid
     */
    void delWeeklyReportDetail(String weeklyReportGuid);

    /**
     * 更新工作集
     * @param weeklyReport
     */
    void updateWeeklyReport(WeeklyReport weeklyReport);

    /**
     * 新增工作集详情
     * @param weeklyReportDetail
     */
    void insertWeeklyReportDetail(WeeklyReportDetail weeklyReportDetail);

    /**
     * 更新工作集详情
     * @param weeklyReportDetail
     */
    void updateWeeklyReportDetail(WeeklyReportDetail weeklyReportDetail);
}
