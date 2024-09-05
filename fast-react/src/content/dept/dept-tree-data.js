import Search from "antd/es/input/Search";
import {Tree} from "antd";
import React from "react";


const DeptTreeData = ({className, listDepList, setSelectedKeys, selectedKeys, treeData}) => {
    //树节点选择
    const onSelect = (selectedKeysValue, info) => {
        if (info.selected) {
            setSelectedKeys(selectedKeysValue);
        }
    };
    return (
        <div className={className}>
            <Search
                style={{
                    marginBottom: 8,
                }}
                placeholder="请输入部门名称..."
                onSearch={(v) => {
                    listDepList({deptName: v})
                }}
            />
            <Tree
                onSelect={onSelect}
                selectedKeys={selectedKeys}
                treeData={treeData}
            />
        </div>
    );
}
export default DeptTreeData

