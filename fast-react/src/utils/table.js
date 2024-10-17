// 处理数据变化
export const handleSave = (index, field, value, data, setData) => {
    const newData = [...data];
    data[index][field] = value
    setData(newData);
}

// 检查数据变化
export const checChanges = (originalData, newData, field) => {
    const delArr = [];
    const changeArr = [];
    const addArr = [];

    // 创建一个旧数据的映射，以便快速查找
    const oldDataMap = originalData.reduce((map, item) => {
        map[item[field]] = item;
        return map;
    }, {});
    // 遍历新数组
    newData.forEach(newItem => {
        const oldItem = oldDataMap[newItem[field]];
        if (!oldItem) {
            // 如果旧数组中不存在此ID，则它是新增的
            addArr.push(newItem);
        } else if (JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
            // 如果旧数组中存在但内容不同，则它是变更的
            // 注意：这里使用JSON.stringify来比较对象，这不是最佳实践，因为它可能因属性顺序不同而失败
            // 在生产环境中，你应该比较每个属性或使用更复杂的比较逻辑
            changeArr.push(newItem);
        }
        // 如果旧数组中存在且内容相同，则不做处理（视为未变更）
        // 从映射中删除已处理的旧项（可选，用于后续查找删除项）
        delete oldDataMap[newItem[field]];
    });

    // 剩下的旧数据映射中的项都是删除的
    delArr.push(...Object.values(oldDataMap));
    return {delArr, changeArr, addArr};

};
