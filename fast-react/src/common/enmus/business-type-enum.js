export const businessTypeEnum = {
    OTHER: 0,
    INSERT: 1,
    UPDATE: 2,
    DELETE: 3,
    GRANT: 4,
    EXPORT: 5,
    IMPORT: 6,
    CLEAN: 7,
    getName: (code) => {
        if (code === 0) return '其它'
        if (code === 1) return '新增'
        if (code === 2) return '修改'
        if (code === 3) return '删除'
        if (code === 4) return '授权    '
        if (code === 5) return '导出'
        if (code === 6) return '导入'
        if (code === 7) return '清空数据'
    }
}
