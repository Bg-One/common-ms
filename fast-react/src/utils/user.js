export const getUserTreeData = (depList, userList, depDisabled) => {
    let data = depList.map(item => ({
        value: item.deptGuid,
        title: <span style={{color: '#000'}}>{item.deptName}</span>,
        disabled: depDisabled,
        children: userList.filter(i => i.deptGuid === item.deptGuid).map(i => ({
            value: i.userGuid,
            title: i.userName,
        }))
    }))
    return data
}
