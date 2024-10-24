package com.example.fastboot.server.producems.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Demandchangerecord {


  private long id;
  private String guid;
  private String nodeGuid;
  private String demandGuid;
  private String projectGuid;
  private String changeDescription;
  private String changeName;
  private Date changeTime;
  private String deleteFlag;

  private Nodes nodes;


}
