package com.example.fastboot.server.producems.model;


import com.example.fastboot.common.config.DateJsonSerialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

/**
 * @TableName producemanage
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Producemanage implements Serializable {
    /**
     *
     */
    private Integer id;

    /**
     *
     */
    private String guid;

    /**
     *
     */
    private String name;

    /**
     *
     */
    private String number;

    /**
     *
     */
    private String produceManager;

    /**
     *
     */
    @JsonSerialize(using = DateJsonSerialize.class)
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    private String factoryReportLink;

    private int acceptanceFlag;
    /**
     *
     */
    private Integer deleteFlag;

    /**
     *
     */
    private String produceManagerName;
    /**
     *
     */
    private String demandManagerName;
    /**
     *
     */
    private String devManagerName;
    /**
     *
     */
    private String checkManagerName;

    private int count;

    private String[] lockProduceGuids;

    private int currentPage;

    private int pageSize;

    private String teamReasourcesList;

    private static final long serialVersionUID = 1L;

}
