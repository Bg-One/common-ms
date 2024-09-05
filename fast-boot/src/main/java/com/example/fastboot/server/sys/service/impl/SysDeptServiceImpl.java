package com.example.fastboot.server.sys.service.impl;

import com.example.fastboot.common.enums.BoolEnum;
import com.example.fastboot.common.enums.CommonResultEnum;
import com.example.fastboot.common.exception.ServiceException;
import com.example.fastboot.server.sys.mapper.SysDeptMapper;
import com.example.fastboot.server.sys.model.SysDept;
import com.example.fastboot.server.sys.service.ISysDeptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

/**
 * @Author bo
 * @Date 2024 07 26 20 41
 **/
@Service
public class SysDeptServiceImpl implements ISysDeptService {

    @Autowired
    private SysDeptMapper sysDeptMapper;


    @Override
    public List<SysDept> selectDeptList(SysDept dept) {
        return sysDeptMapper.selectDeptList(dept);
    }

    /**
     * 校验部门名称是否唯一
     *
     * @param dept 部门信息
     * @return 结果
     */
    @Override
    public boolean checkDeptNameUnique(SysDept dept) {
        SysDept sysDept = sysDeptMapper.checkDeptNameUnique(dept.getDeptName(), dept.getParentGuid(), dept.getDeptGuid());
        return sysDept == null;
    }

    /**
     * 新增保存部门信息
     *
     * @param dept 部门信息
     * @return 结果
     */
    @Override
    public void insertDept(SysDept dept) {
        SysDept sysDept = sysDeptMapper.selectDeptByGuid(dept.getParentGuid());
        if (sysDept != null) {
            dept.setAncestors(sysDept.getAncestors() + "," + dept.getParentGuid());
        }
        sysDeptMapper.insertDept(dept);
    }

    /**
     * 修改保存部门信息
     *
     * @param dept 部门信息
     * @return 结果
     */
    @Override
    public void updateDept(SysDept dept) {
        SysDept newParentDept = sysDeptMapper.selectDeptByGuid(dept.getParentGuid());
        SysDept oldDept = sysDeptMapper.selectDeptByGuid(dept.getDeptGuid());
        if (!Objects.isNull(newParentDept) && !Objects.isNull(oldDept)) {
            String newAncestors = newParentDept.getAncestors() + "," + newParentDept.getDeptGuid();
            String oldAncestors = oldDept.getAncestors();
            dept.setAncestors(newAncestors);
            updateDeptChildren(dept.getDeptGuid(), newAncestors, oldAncestors);
        }
        sysDeptMapper.updateDept(dept);
    }

    @Override
    public boolean hasChildByDeptId(String deptGuid) {
        int result = sysDeptMapper.hasChildByDeptGuid(deptGuid);
        return result > 0;
    }

    /**
     * 修改子元素关系
     *
     * @param deptGuid     被修改的部门唯一标识
     * @param newAncestors 新的父ID集合
     * @param oldAncestors 旧的父ID集合
     */
    public void updateDeptChildren(String deptGuid, String newAncestors, String oldAncestors) {
        List<SysDept> children = sysDeptMapper.selectChildrenDeptByGuid(deptGuid);
        for (SysDept child : children) {
            child.setAncestors(child.getAncestors().replaceFirst(oldAncestors, newAncestors));
        }
        if (children.size() > 0) {
            sysDeptMapper.updateDeptChildren(children);
        }
    }

    /**
     * 查询部门是否存在用户
     *
     * @param deptGuid 部门唯一标识
     * @return 结果 true 存在 false 不存在
     */
    @Override
    public boolean checkDeptExistUser(String deptGuid) {
        int result = sysDeptMapper.checkDeptExistUser(deptGuid);
        return result > 0;
    }

    @Override
    public void deleteDeptById(String deptGuid) {
        sysDeptMapper.deleteDeptByGuid(deptGuid);
    }
}
