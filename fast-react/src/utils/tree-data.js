/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param name
 * @param parentGuid
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data, id, name = 'name', parentGuid = 'parentGuid', children = 'children') {

    let childrenListMap = {};
    let nodeIds = {};
    let tree = [];

    for (let d of data) {
        let parentId = d[parentGuid];
        if (childrenListMap[parentId] == null) {
            childrenListMap[parentId] = [];
        }
        nodeIds[d[id]] = d;
        childrenListMap[parentId].push({...d, value: d[id], title: d[name], key: d[id]});
    }
    for (let d of data) {
        let parentGuidVar = d[parentGuid];
        if (nodeIds[parentGuidVar] == null) {
            tree.push({...d, value: d[id], title: d[name], key: d[id]});
        }
    }
    for (let t of tree) {
        adaptToChildrenList(t);
    }

    function adaptToChildrenList(o) {
        if (childrenListMap[o[id]] !== null) {
            o[children] = childrenListMap[o[id]];
        }
        if (o[children]) {
            for (let c of o[children]) {
                adaptToChildrenList(c);
            }
        }
    }

    return tree;
}

export function findParentByKey(tree, targetKey, parent = null) {
    // 遍历每个节点
    for (let node of tree) {
        // 检查当前节点是否为我们正在寻找的子节点
        if (node.key === targetKey) {
            // 如果找到了，返回父节点
            return parent;
        }
        // 如果当前节点有子节点，则递归查找
        if (node.children && node.children.length > 0) {
            const result = findParentByKey(node.children, targetKey, node);
            if (result) {
                // 如果在子树中找到了，则返回结果
                return result;
            }
        }
    }
    // 如果没有找到，返回null
    return null;
}

//生成tree项
export const createTreeItem = (title, key, icon, children, disable) => {
    return {key, value: key, icon, children, title, disabled: !disable};
}
//创建需求节点
export const createFuncDemandNode = (item, classType) => {
    let newNodeList = []
    item.forEach((i) => {
        if (i.classType === classType) {
            newNodeList.push(createTreeItem(i.name, i.guid, '', i.children ? createFuncDemandNode(i.children, classType) : '', i.nodeType))
        }
    })
    return newNodeList;
}
// 递归查找负荷条件的对象
export const getObjByConditon = (dataList, condition) => {
    for (let item of dataList || []) {
        if (condition(item)) return item
        const newItem = getObjByConditon(item.child, condition)
        if (newItem) return newItem
    }
}
