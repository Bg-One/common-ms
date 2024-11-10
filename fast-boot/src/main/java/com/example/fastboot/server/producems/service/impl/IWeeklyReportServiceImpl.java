package com.example.fastboot.server.producems.service.impl;

import cn.hutool.core.date.DateUtil;
import com.alibaba.fastjson2.JSONArray;
import com.example.fastboot.server.producems.mapper.WeeklyReportMapper;
import com.example.fastboot.server.producems.model.WeeklyReport;
import com.example.fastboot.server.producems.model.WeeklyReportDetail;
import com.example.fastboot.server.producems.service.IWeeklyReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * @Author bo
 * @Date 2024 11 07 14 20
 **/
@Service
@Transactional
public class IWeeklyReportServiceImpl implements IWeeklyReportService {
    @Autowired
    private WeeklyReportMapper weeklyReportMapper;

    @Override
    public List<WeeklyReport> listWeeklyReporterSet(WeeklyReport weeklyReport) {
        return weeklyReportMapper.listWeeklyReporterSet(weeklyReport);
    }

    @Override
    public WeeklyReport getWeeklyReporterSetDetail(String guid) {
        return weeklyReportMapper.getWeeklyReporterSetDetail(guid);
    }

    @Override
    public void addWeeklyReport(WeeklyReport weeklyReport) {
        weeklyReport.setGuid(UUID.randomUUID().toString());
        weeklyReport.setCreateTime(DateUtil.date());
        weeklyReportMapper.addWeeklyReport(weeklyReport);
    }

    @Override
    public void delWeeklyReport(String guid) {
        weeklyReportMapper.delWeeklyReport(guid);
        weeklyReportMapper.delWeeklyReportDetail(guid);
    }

    @Override
    public void updateWeeklyReport(WeeklyReport weeklyReport) {
        weeklyReportMapper.updateWeeklyReport(weeklyReport);
    }

    @Override
    public void addOrEditWeeklyReportDetail(WeeklyReport weeklyReport) {
        weeklyReportMapper.updateWeeklyReport(weeklyReport);
        String weeklyReportDetailJson = weeklyReport.getWeeklyReportDetailJson();
        if (weeklyReportDetailJson != null && !weeklyReportDetailJson.equals("")) {
            List<WeeklyReportDetail> weeklyReportDetails = JSONArray.parseArray(weeklyReportDetailJson, WeeklyReportDetail.class);
            for (WeeklyReportDetail weeklyReportDetail : weeklyReportDetails) {
                if (weeklyReportDetail.getGuid() == null || weeklyReportDetail.getGuid().equals("")) {
                    weeklyReportDetail.setGuid(UUID.randomUUID().toString());
                    weeklyReportDetail.setCreateTime(DateUtil.date());
                    weeklyReportMapper.insertWeeklyReportDetail(weeklyReportDetail);
                } else {
                    weeklyReportMapper.updateWeeklyReportDetail(weeklyReportDetail);
                }
            }
        }

    }

    @Override
    public void delWeeklyReportDetail(String guid) {
        weeklyReportMapper.delWeeklyReportDetail(guid);
    }
}
