// 处理菜单/面包屑 返回所属的从根开始的item对象数据
export let findLabelsByKey = (menuConfig, targetKey) => {
    const itemList = []
    let dfs = (node, path) => {
        if (node.key === targetKey) {
            itemList.push(node)
            return true
        }
        if (node.children) {
            for (let childNode of node.children) {
                if (dfs(childNode, path.concat(node.label))) {
                    itemList.push(node)
                    return true
                }
            }
        }
        return false
    }
    for (let menuItem of menuConfig) {
        if (dfs(menuItem, [])) break
    }
    return itemList.reverse()
}

export let findMenuInfoByKeyAndField = (menuConfig, targetKey, field) => {
    let menuInfo = ''
    let dfs = (node) => {
        if (node.key === targetKey) {
            menuInfo = node[field]
            return true
        }
        if (node.children) {
            for (let childNode of node.children) {
                if (dfs(childNode)) {
                    menuInfo = childNode[field]
                    return true
                }
            }
        }
        return false
    }
    for (let menuItem of menuConfig) {
        if (dfs(menuItem)) break
    }
    return menuInfo
}
