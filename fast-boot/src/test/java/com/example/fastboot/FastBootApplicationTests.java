package com.example.fastboot;

import com.example.fastboot.server.producems.mapper.DepUserMapper;
import com.example.fastboot.server.producems.model.DepUser;
import com.example.fastboot.server.sys.model.SysUser;
import com.example.fastboot.server.sys.service.ISysUserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class FastBootApplicationTests {


    @Autowired
    private DepUserMapper depUserMapper;
    @Autowired
    private ISysUserService sysUserService;

    /**
     * 人员倒库
     */
    @Test
    void contextLoads() {
        List<DepUser> depUsers = depUserMapper.listDepUser();
        for (DepUser depUser : depUsers) {
            SysUser sysUser = new SysUser();
            sysUser.setUserGuid(depUser.getGuid());
            sysUser.setUserName(depUser.getTrueName());
            sysUser.setNickName(depUser.getName());
            sysUser.setPassword(depUser.getPassword());
            sysUser.setDeptGuid(depUser.getDepGuid());
            sysUser.setSex("1");
            sysUser.setStatus("1");
            sysUserService.insertUser(sysUser);
        }
    }

}
