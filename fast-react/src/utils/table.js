// 处理数据变化
export const handleSave = (index, field, value, data, setData) => {
    const newData = deepCopy(data);
    newData[index][field] = value
    setData(newData);
}

// 检查数据变化
export const checkChanges = (originalData, newData, field) => {
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

//深拷贝
export const deepCopy = (obj) => {
    return JSON.parse(JSON.stringify(obj))
}
export const deepEqual = (objA, objB) => {
    console.log(objA)
    console.log(objB)
    if (objA === objB) {
        return true;
    }

    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
        return false;
    }

    let keysA = Object.keys(objA);
    let keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
        return false;
    }

    for (let key of keysA) {
        if (!keysB.includes(key) || !deepEqual(objA[key], objB[key])) {
            return false;
        }
    }

    return true;
}

export const mergesFilter = (arr, record, rules) => {
    rules.map(item => arr = arr.filter(i => i[item] === record[item]))
    let dataIndex = arr.findIndex(item => item.guid === record.guid)
    if (dataIndex === 0) return { rowSpan: arr.length }
    return { rowSpan: 0 }
}
