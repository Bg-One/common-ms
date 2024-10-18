import { Input, Tree } from 'antd';
import React, { useMemo, useState } from 'react';
const { Search } = Input;

import './tree-search.scss'
const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some((item) => item.key === key)) {
                parentKey = node.key;
            } else if (getParentKey(key, node.children)) {
                parentKey = getParentKey(key, node.children);
            }
        }
    }
    return parentKey;
};

const TreeSearch = ({defaultData,dataList,onSelect}) => {
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const onExpand = (newExpandedKeys) => {
        setExpandedKeys(newExpandedKeys);
        setAutoExpandParent(false);
    };

    const allData = [];
    const generateList = (data) => {
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            allData.push({
                key:node.guid,
                title: node.name,
            });
            if (node.child) {
                generateList(node.child);
            }
        }
    };
    generateList(dataList)
    const onChange = (e) => {
        const { value } = e.target;
        const newExpandedKeys = allData.map((item) => {
                if (item.title.indexOf(value) > -1) {
                    return getParentKey(item.key, defaultData);
                }
                return null;
            })
            .filter((item, i, self) => item && self.indexOf(item) === i);
        setExpandedKeys(newExpandedKeys);
        setSearchValue(value);
        setAutoExpandParent(true);
    };

    //当搜索内容变更时自动计算，避免重复计算
    //递归变更样式
    const treeData = useMemo(() => {
        const loop = (data) =>
            data.map((item) => {
                const strTitle = item.title;
                const index = strTitle.indexOf(searchValue);
                const beforeStr = strTitle.substring(0, index);
                const afterStr = strTitle.slice(index + searchValue.length);
                const title =
                    index > -1 ? (
                        <span>
              {beforeStr}
                            <span className="site-tree-search-value">{searchValue}</span>
                            {afterStr}
            </span>
                    ) : (
                        <span>{strTitle}</span>
                    );
                if (item.children) {
                    return {
                        title,
                        key: item.key,
                        children: loop(item.children),
                    };
                }
                return {
                    title,
                    key: item.key,
                };
            });
        return loop(defaultData);
    }, [searchValue,defaultData]);
    return (
        <div>
            <Search
                style={{
                    marginBottom: 8,
                }}
                placeholder="Search"
                onChange={onChange}
            />
            <Tree
                onSelect={(e)=>{
                    onSelect(e,allData.find(item=>item.key===e[0]).title)
                }}
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                treeData={treeData}
            />
        </div>
    );
};
export default TreeSearch;
