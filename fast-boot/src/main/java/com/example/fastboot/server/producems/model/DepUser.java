package com.example.fastboot.server.producems.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DepUser {
    private Integer id;
    private String guid;
    private String name;
    private String trueName;
    private String identifiedShortName;
    private String depGuid;
    private String password;
    private String gpms_ID;
    private String mobile;

    private String userName;

    private String userGuid;

    private String userRoleName;
    private String managerName;
    private String managerGuid;
    private String managerRole;
    private String depName;
    private String notCreateWeekDay;


}
