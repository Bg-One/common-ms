package com.example.fastboot.server.producems.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Detaileddesign {

  private long id;
  private String guid;
  private String nodeGuid;
  private String createName;
  @DateTimeFormat(pattern="yyyy-MM-dd")
  private Date createTime;
  private String processAnalysis;
  private String configurationRequirements;
  private String classDesign;
  private String dbOperate;
  private String communicationDesignDescription;
  private String complexLogic;
  private String notes;
  private int deleteFlag;




}
