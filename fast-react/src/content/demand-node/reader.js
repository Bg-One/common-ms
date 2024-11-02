import {Button} from "antd";
import TinymceEditor from "../tinymce";
import React from "react";
import {hasRoleOr} from "../../utils/permi";
import {useSelector} from "react-redux";

const Reader = ({demandManage, setDemandManage, saveDemand}) => {
    let userInfo = useSelector(state => state.user.userInfo);
    const editFlag = hasRoleOr(userInfo, ['pro:dept:user', 'pro:dept:manager'])

    return <div className="reader-area">
        <Button type={'primary'} onClick={saveDemand} disabled={!editFlag}>保存</Button>
        <span className="title-span">读者对象</span>
        <TinymceEditor id={'reader'} data={demandManage.reader} func={(data) => {
            setDemandManage({
                ...demandManage,
                reader: data
            })
        }}/>

    </div>
}
export default Reader
