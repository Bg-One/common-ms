import './layout-header.scss'
import LayoutBreadCrum from './layout-breadCrum'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import {useNavigate} from "react-router-dom";
import {Avatar, Badge, Button, message} from "antd";
import {useDispatch} from "react-redux";
import {logoutApi} from "../../common/api/sys/sys-api";
import {setAuthentication, setLoading, setMenuConfig, setRouters, setUserInfo} from "../../redux/user/user-slice";
import {getToken, removeToken} from "../../utils/auth";
import Websocket from "react-websocket";
import http from "../../utils/http";
import {useEffect, useState} from "react";
import useWebSocket from "../../common/usehooks/useHooks";

const LayoutHeader = ({toggleCollapsed, collapsed}) => {
    let navigate = useNavigate();
    let dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const {data, sendMessage} = useWebSocket(`${http.websocketURL}websocket/globalWs?Authorization=Bearer ` + getToken());


    const logout = () => {
        logoutApi().then(res => {
            message.success('退出成功')
            removeToken()
            dispatch(setAuthentication(false))
            dispatch(setUserInfo({}))
            dispatch(setLoading(true))
            dispatch(setRouters([]))
            dispatch(setMenuConfig([]))
            navigate('/login')
        })
    }
    return <div id={"layout-header"}>
        <div className="layout-header-content">
            <div>
                <Button
                    type="primary"
                    onClick={toggleCollapsed}
                    style={{
                        marginBottom: 16,
                    }}
                >
                    {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                </Button>
                <LayoutBreadCrum/>
            </div>
            <div className={"layout-header-user"}>
                <Badge count={1}>
                    <Avatar size={40} shape="square" icon={<img src={''}/>}/>
                </Badge>
                <span>用户名</span>
            </div>
            {/*<span onClick={logout}>退出登录</span>*/}
        </div>
        {/*<Websocket*/}
        {/*    protocol="tcp"*/}
        {/*    url={`${http.websocketURL}websocket/globalWs?Authorization=Bearer ` + getToken()}*/}
        {/*    reconnect={true} debug={true}/>*/}
    </div>
}

export default LayoutHeader
