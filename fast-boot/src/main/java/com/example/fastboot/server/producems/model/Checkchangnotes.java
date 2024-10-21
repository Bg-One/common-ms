package com.example.fastboot.server.producems.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Checkchangnotes {
    private int id;
    private String guid;
    private String checkFeedbackGuid;
    private String dbChange;
    private String configurationChange;
    private String scopeOfInfluence;
    private String checkSuggestion;
    private String deleteFlag;

}
