package com.example.fastboot.server.sys.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;
import java.util.List;


/**
 * @author liuzhaobo
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SysUser implements Serializable {
    private static final long serialVersionUID = 1L;
    /**
     * 用户唯一标识
     */
    private Integer id;
    /**
     * 用户唯一标识
     */
    private String userGuid;

    /**
     * 部门唯一标识
     */
    private String deptGuid;

    /**
     * 用户账号
     */
    private String userName;

    /**
     * 用户昵称
     */
    private String nickName;

    /**
     * 用户邮箱
     */
    private String email;

    /**
     * 手机号码
     */
    private String phonenumber;

    /**
     * 用户性别
     */
    private String sex;

    /**
     * 用户头像
     */
    private String avatar;

    /**
     * 密码
     */
    private String password;

    /**
     * 帐号状态（0正常 1停用）
     */
    private String status;

    /**
     * 删除标志（0代表存在 2代表删除）
     */
    private String delFlag;

    /**
     * 最后登录IP
     */
    private String loginIp;

    /**
     * 最后登录时间
     */
    private Date loginDate;

    /**
     * 创建者
     */
    private String createBy;

    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    /**
     * 更新者
     */
    private String updateBy;

    /**
     * 更新时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    /**
     * 备注
     */
    private String remark;

    /**
     * 部门对象
     */
    private SysDept dept;

    /**
     * 岗位对象
     */
    private List<SysPost> posts;
    /**
     * 角色对象
     */
    private List<SysRole> roles;

    /**
     * 角色组
     */
    private String[] roleGuids;

    /**
     * 角色
     */
    private String roleGuid;
    /**
     * 岗位唯一标识组
     */
    private String[] postGuids;
    /**
     * 岗位组
     */
    private String[] postNames;
    /**
     * 是否绑定某角色
     */
    private int bindFlag;

    public boolean isAdmin() {
        return isAdmin(this.userGuid);
    }

    public static boolean isAdmin(String userGuid) {
        return "1".equals(userGuid);
    }
}
