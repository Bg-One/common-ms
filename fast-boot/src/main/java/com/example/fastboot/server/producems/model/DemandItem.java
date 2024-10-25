package com.example.fastboot.server.producems.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DemandItem {

    private long id;
    private String guid;
    private String nodeGuid;
    private long degreeOfImportance;
    private long priority;
    private long demandState;
    private String funDescription;
    private String preconditions;
    private String entry;
    private String eventStream;
    private String output;
    private String postconditions;
    private String logRecord;

    private String otherNotes;
    private String question;
    private String passedFlag;
    private String questionAndNotes;
    private String severity;
    private String deleteFlag;

    private String demandTraceGuid;
    private Integer demandConfiemedState;
    private boolean changeFlag;
    private String nodeName;
    private Nodes nodes;

    private String demandName;

}
