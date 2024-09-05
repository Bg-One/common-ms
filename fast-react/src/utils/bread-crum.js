
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
