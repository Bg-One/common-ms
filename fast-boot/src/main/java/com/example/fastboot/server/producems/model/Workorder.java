package com.example.fastboot.server.producems.model;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

/**
 * @TableName workorder
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Workorder implements Serializable {
    /**
     *
     */
    @ExcelIgnore
    private Integer id;

    /**
     *
     */
    @ExcelIgnore
    private String guid;

    /**
     *
     */
    @ExcelIgnore
    private String workTypeGuid;

    /**
     *
     */
    @ExcelProperty(value = "项目名称", index = 2)
    @ColumnWidth(30)
    private String projectName;

    /**
     *
     */
    @ExcelIgnore
    private String projectGuid;

    /**
     *
     */
    @ExcelIgnore
    private String workCategoryGuid;

    /**
     *
     */
    @ExcelIgnore
    private String workItemGuid;

    /**
     *
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    @ExcelIgnore
    private Date createTime;

    /**
     *
     */
    @ExcelIgnore
    private Integer status;

    /**
     *
     */
    @ExcelProperty(value = "执行人", index = 8)
    private String createName;

    /**
     *
     */
    @ExcelIgnore
    private String createGuid;

    /**
     *
     */
    @ExcelIgnore
    private String departmentName;

    /**
     *
     */
    @ExcelIgnore
    private String departmentGuid;

    /**
     *
     */
    @ExcelProperty(value = "工时", index = 7)
    private Double workDuration;

    /**
     *
     */
    @ExcelIgnore
    private String demandItemName;

    /**
     *
     */
    @ExcelIgnore
    private String demandItemGuid;

    /**
     *
     */
    @ExcelProperty(value = "工作内容", index = 6)
    @ColumnWidth(20)
    private String content;

    /**
     *
     */
    @ExcelIgnore
    private String reason;

    /**
     *
     */
    @ExcelIgnore
    private String reviewName;

    @ExcelIgnore
    private String reviewGuid;


    @ExcelIgnore
    private Double allWorkDuration;
    @ExcelIgnore
    private Double projectWorkDuration;
    @ExcelProperty(value = "项目部工作", index = 10)
    @ColumnWidth(15)
    private String projectDepWorkType;
    @ExcelIgnore
    private Double projectDepWorkDuration;
    @ExcelIgnore
    private int teamGroup;

    @ExcelProperty(value = "工作条目", index = 5)
    @ColumnWidth(15)
    private String workItem;

    @ExcelProperty(value = "工作类目", index = 4)
    @ColumnWidth(15)
    private String workCategory;

    @ExcelProperty(value = "工作类型", index = 3)
    @ColumnWidth(15)
    private String workType;

    @ExcelProperty(value = "项目经理(生产负责人)", index = 9)
    private String managerName;
    @ExcelProperty(value = "项目编号", index = 1)
    @ColumnWidth(20)
    private String projectNo;
    @ExcelIgnore
    private String proportion;
    @ExcelIgnore
    private static final long serialVersionUID = 1L;

    @ExcelProperty(value = "工作日期(按日写)", index = 0)
    @ColumnWidth(15)
    private String createTimeToExcel;

    @ExcelIgnore
    private Integer projectDepworkTypeId;

    private String workItemName;

    private String workCategoryName;

    private String workTypeName;

    private String startTime;

    private String endTime;

    private String workStatus;

    private String guids;
}
