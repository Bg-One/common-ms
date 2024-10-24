package com.example.fastboot.server.producems.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Demandmanage {

    private long id;
    private String guid;
    private String produceGuid;
    private long staus;
    private Date createTime;
    private String objective;
    private String reader;
    private String reviewComments;
    private String version;
    private String deleteFlag;
    private Boolean devFinishFlag;
    private Producemanage produceManage;

    private Producemember producemember;

    private int existTeamResource;

    private String makeManager;
    private int currentPage;
    private int pageSize;

    private String produceName;
    private String produceManagerName;
    /**
     *
     */
    private String demandManagerName;
}
