package com.example.fastboot.server.producems.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageToPerson {

  private long id;
  private String messageGuid;
  private String responsiblePerson;
  private String responsiblePersonGuid;
  private String readFlag;



}
