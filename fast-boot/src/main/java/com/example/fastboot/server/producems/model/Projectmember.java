package com.example.fastboot.server.producems.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Projectmember {
    private int id;
    private String projectGuid;
    private int teamResource;
    private String managerGuid;

    private String groupMemsGuids;

    private String managerName;

    private String groupMemsNames;

}
