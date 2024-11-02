import {Button} from "antd";
import TinymceEditor from "../tinymce";
import React from "react";
import './index.scss'
import {useSelector} from "react-redux";
import {hasRoleOr} from "../../utils/permi";

const Objective = ({demandManage, setDemandManage, saveDemand}) => {
    let userInfo = useSelector(state => state.user.userInfo);
    const editFlag = hasRoleOr(userInfo, ['pro:dept:user', 'pro:dept:manager'])
    return <div className="objective-area">
        <Button type={'primary'} onClick={saveDemand} disabled={!editFlag}>保存</Button>
        <span className="title-span">目的</span>
        <TinymceEditor id={'objective'} data={demandManage.objective} func={(data) => {
            setDemandManage({
                ...demandManage,
                objective: data
            })
        }}/>
    </div>
}
export default Objective
