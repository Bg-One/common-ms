export const getUserTreeData = (depList, userList, depDisabled) => {
    let data = depList.map(item => ({
        value: item.deptGuid,
        title: <span style={{color: '#000'}}>{item.deptName}</span>,
        disabled: depDisabled,
        children: userList.filter(i => i.deptGuid === item.deptGuid).map(i => ({
            value: i.userGuid,
            title: i.nickName,
        }))
    }))
    return data
}
//根据单位唯一标识获取用户唯一标识
export const getUserGiudsByDepGuids = (userList, depList, dataList) => {
    let arr = []
    dataList.map(item => {
        userList.map(i => {
            if (i.userGuid === item) {
                arr.push(item)
            }
        })
        depList.map(i => {
            if (i.deptGuid === item) {
                arr = arr.concat(userList.filter(p => p.deptGuid === item).map(p => p.userGuid))
            }
        })
    })
    return Array.from(new Set(arr))
}
//改变项目组成员
export const changeGroupMems = (v, option, index, resourcesList) => {
    let newTeamResourcesList = [...resourcesList]
    newTeamResourcesList[index].groupMemsGuids = v.join('、')
    return newTeamResourcesList
}
//改变负责人
export const changManage = (index, v, option, resourcesList) => {
    let newTeamResourcesList = [...resourcesList]
    let groupMemsGuids = newTeamResourcesList[index].groupMemsGuids;
    newTeamResourcesList[index].managerGuid = v
    newTeamResourcesList[index].groupMemsGuids = groupMemsGuids ? groupMemsGuids : ''
    return newTeamResourcesList
}
