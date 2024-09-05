package com.example.fastboot.server.sys.controller;

import com.example.fastboot.common.aspectj.annotation.SysLog;
import com.example.fastboot.common.aspectj.enums.BusinessType;
import com.example.fastboot.common.enums.BoolEnum;
import com.example.fastboot.common.enums.CommonResultEnum;
import com.example.fastboot.common.exception.ServiceException;
import com.example.fastboot.common.response.CommonResult;
import com.example.fastboot.server.sys.model.SysDept;
import com.example.fastboot.server.sys.service.ISysDeptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * @Author bo
 * @Date 2024 07 26 20 35
 **/
@RestController
@RequestMapping("/dept")
public class SysDepController {
    @Autowired
    private ISysDeptService iSysDeptService;

    /**
     * 获取部门列表
     */
    @PreAuthorize("@permission.hasAuthority('system:dept:list')")
    @PostMapping("/listDept")
    public Object listDep(SysDept dept) {
        List<SysDept> depts = iSysDeptService.selectDeptList(dept);
        return CommonResult.success(depts);
    }

    /**
     * 新增部门
     */
    @PreAuthorize("@permission.hasAuthority('system:dept:add')")
    @SysLog(title = "部门管理", businessType = BusinessType.INSERT)
    @PostMapping("/addDept")
    public Object add(SysDept dept) {
        dept.setDeptGuid(UUID.randomUUID().toString());
        if (!iSysDeptService.checkDeptNameUnique(dept)) {
            throw new ServiceException(CommonResultEnum.DEPT_EXIST);
        }
        dept.setCreateBy(Base.getCreatUserName());
        iSysDeptService.insertDept(dept);
        return CommonResult.success();
    }

    /**
     * 修改部门
     */
    @PreAuthorize("@permission.hasAuthority('system:dept:edit')")
    @SysLog(title = "部门管理", businessType = BusinessType.UPDATE)
    @PostMapping("/updateDept")
    public Object updateDept(SysDept dept) {
        String deptGuid = dept.getDeptGuid();
        if (!iSysDeptService.checkDeptNameUnique(dept)) {
            throw new ServiceException(CommonResultEnum.DEPT_EXIST);
        } else if (dept.getParentGuid().equals(deptGuid)) {
            throw new ServiceException(CommonResultEnum.BELONG_SELF_DISABLE);
        }
        dept.setUpdateBy(Base.getCreatUserName());
        iSysDeptService.updateDept(dept);
        return CommonResult.success();
    }

    /**
     * 删除部门
     */
    @PreAuthorize("@permission.hasAuthority('system:dept:remove')")
    @SysLog(title = "部门管理", businessType = BusinessType.DELETE)
    @PostMapping("/deleteDept")
    public Object deleteDept(String deptGuid) {
        if (iSysDeptService.hasChildByDeptId(deptGuid)) {
            throw new ServiceException(CommonResultEnum.EXIST_DEPT_DISABLE);
        }
        if (iSysDeptService.checkDeptExistUser(deptGuid)) {
            throw new ServiceException(CommonResultEnum.EXIST_USER_DISABLE);
        }
        iSysDeptService.deleteDeptById(deptGuid);
        return CommonResult.success();
    }
}
