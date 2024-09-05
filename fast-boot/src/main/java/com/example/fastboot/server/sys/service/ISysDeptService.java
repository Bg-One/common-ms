package com.example.fastboot.server.sys.service;

import com.example.fastboot.server.sys.model.SysDept;

import java.util.List;

/**
 * @Author bo
 * @Date 2024 07 26 20 41
 **/
public interface ISysDeptService {
    /**
     * 获取全部
     *
     * @param dept
     * @return
     */
    List<SysDept> selectDeptList(SysDept dept);

    /**
     * 校验部门名称是否唯一
     *
     * @param dept 部门信息
     * @return 结果
     */
    boolean checkDeptNameUnique(SysDept dept);

    /**
     * 新增保存部门信息
     *
     * @param dept 部门信息
     * @return 结果
     */
    void insertDept(SysDept dept);

    /**
     * 修改保存部门信息
     *
     * @param dept 部门信息
     * @return 结果
     */
    void updateDept(SysDept dept);


    /**
     * 是否存在子单位
     *
     * @param deptGuid 父单位唯一标识
     * @return 结果
     */
    boolean hasChildByDeptId(String deptGuid);

    /**
     * 是否存在用户
     *
     * @param deptGuid 单位唯一标识
     * @return 结果
     */
    boolean checkDeptExistUser(String deptGuid);

    /**
     * 删除单位
     *
     * @param deptGuid 单位唯一标识
     */
    void deleteDeptById(String deptGuid);
}
