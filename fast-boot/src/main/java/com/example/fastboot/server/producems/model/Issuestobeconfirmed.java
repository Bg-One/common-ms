package com.example.fastboot.server.producems.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Issuestobeconfirmed {

  private long id;
  private String guid;
  private String demandGuid;
  private String issuesContent;
  private int deleteFlag;




}
