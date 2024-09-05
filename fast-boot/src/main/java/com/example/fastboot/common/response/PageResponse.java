package com.example.fastboot.common.response;

import com.alibaba.fastjson2.annotation.JSONField;
import com.example.fastboot.server.sys.model.SysLogininfor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.github.pagehelper.PageInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @Author bo
 * @Date 2024 08 07 14 00
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageResponse<T> {

    // 当前页码
    private int currentPage;

    // 每页显示数量
    private int pageSize;

    // 总记录数
    private long total;

    // 总页数
    private int totalPages;

    // 数据列表
    private List<T> list;
    @JsonIgnore
    private PageInfo<T> pageInfo;

    public PageResponse(PageInfo<T> pageInfo) {
        this.total = pageInfo.getTotal();
        this.totalPages = pageInfo.getPages();
        this.currentPage = pageInfo.getPageNum();
        this.pageSize = pageInfo.getPageSize();
        this.list = pageInfo.getList();
    }
}
