package com.example.fastboot.server.sys.mapper;

import com.example.fastboot.server.sys.model.SysDept;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author bo
 * @Date 2024 07 26 20 43
 **/
@Repository
public interface SysDeptMapper {

    /**
     * 获取全部单位
     *
     * @return 全部单位
     */
    List<SysDept> selectDeptList(SysDept dept);

    /**
     * 校验部门名称是否唯一
     *
     * @param deptName   部门名称
     * @param parentGuid 父部门唯一标识
     * @return 结果
     */
    SysDept checkDeptNameUnique(@Param("deptName") String deptName, @Param("parentGuid") String parentGuid,@Param("deptGuid") String deptGuid);

    /**
     * 根据父节点查询
     *
     * @param parentGuid 父节点
     * @return 父节点
     */
    SysDept selectDeptByGuid(String parentGuid);

    /**
     * 新增部门
     *
     * @param dept
     */
    void insertDept(SysDept dept);

    /**
     * 修改部门信息
     *
     * @param dept 部门信息
     * @return 结果
     */
    void updateDept(SysDept dept);

    /**
     * 根据部门ID查询子部门
     *
     * @param deptGuid 部门唯一标识
     * @return 部门信息
     */
    List<SysDept> selectChildrenDeptByGuid(String deptGuid);

    /**
     * 修改子元素关系
     *
     * @param depts 子元素
     * @return 结果
     */
    void updateDeptChildren(@Param("depts") List<SysDept> depts);

    /**
     * 单位下是否存在用户数
     *
     * @param deptGuid 单位唯一标识
     * @return 数量
     */
    int checkDeptExistUser(String deptGuid);

    /**
     * 单位下是否存在子单位
     *
     * @param deptGuid 单位唯一标识
     * @return 结果
     */
    int hasChildByDeptGuid(String deptGuid);

    /**
     * 删除单位
     *
     * @param deptGuid 单位唯一标识
     */
    void deleteDeptByGuid(String deptGuid);
}
