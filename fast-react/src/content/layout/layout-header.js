import './layout-header.scss'

import {useNavigate} from "react-router-dom";
import {Avatar, Badge, Button, Dropdown, Form, Input, message, Modal} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {logoutApi} from "../../common/api/sys/sys-api";
import {
    changeMenuConfig,
    clearUserInfo, setMenuConfig
} from "../../redux/user/user-slice";
import {getToken, removeToken} from "../../utils/auth";
import http from "../../utils/http";
import {useEffect, useState} from "react";
import useWebSocket from "../../common/usehooks/useHooks";
import admin from '../../static/images/admin.png'
import {cleanTab} from "../../redux/tab/tab-slice";
import {resetPwdApi} from "../../common/api/sys/user-api";
import {sm3} from "sm-crypto";
import {deepCopy} from "../../utils/table";
import {
    countWorkOrderStatusApi
} from "../../common/api/producems/workorder";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import LayoutBreadCrum from "./layout-breadCrum";

const {confirm} = Modal;

const LayoutHeader = ({toggleCollapsed, collapsed}) => {
    let [editForm] = Form.useForm();
    let navigate = useNavigate();
    let dispatch = useDispatch();
    let [changePassVisible, setChangePassVisible] = useState(false)
    let userInfo = useSelector(state => state.user.userInfo);
    let menuConfig = useSelector(state => state.user.menuConfig);

    const {
        data,
        sendMessage
    } = useWebSocket(`${http.websocketURL}websocket/globalWs?Authorization=Bearer ` + getToken());

    useEffect(() => {
        countWorkorder().then((res) => {
            let deepCopyMenuConfig = deepCopy(menuConfig);
            for (const ele of deepCopyMenuConfig) {
                if (ele.key === '/home/order') {
                    for (const eleChild of ele.children) {
                        let label = eleChild.label
                        if (eleChild.key === '/home/order/work-submit') {
                            label = <span>{eleChild.label}
                                <Badge count={res.data.waitSubmitCount} color={"orange"} style={{marginLeft: '1vw'}}/>
                                    <Badge count={res.data.checkFaildCount}/>
                            </span>
                        } else if (eleChild.key === '/home/order/work-wait-checked') {
                            label = <span>{eleChild.label}
                                <Badge count={res.data.waitCheckCount} style={{marginLeft: '1vw'}}
                                       color={"orange"}/></span>
                        } else if (eleChild.key === '/home/order/work-submit') {
                            label =
                                <span>{eleChild.label} <Badge count={res.data.checkCount}
                                                              style={{marginLeft: '1vw'}} color={"orange"}/></span>
                        }
                        eleChild.label = label
                    }
                }
            }
            dispatch(changeMenuConfig(deepCopyMenuConfig))

        })
    }, [])

    const logout = () => {
        confirm({
            title: '退出登录',
            content: '确定是否退出当前登录？',
            cancelButtonProps: {
                disabled: true,
                style: {
                    display: 'none'
                }
            },
            onOk() {
                return new Promise((resolve, reject) => {
                    //跳到首页
                    clearLoginInfo()
                    resolve()
                }).catch();
            },
            onCancel() {
            },
        });
    }

    const onFinish = async (values) => {
        await resetPwdApi({
            userGuid: userInfo.user.userGuid,
            password: sm3(values.password),
        })
        message.success('修改成功')
        clearLoginInfo()
    }

    const clearLoginInfo = () => {
        logoutApi().then(res => {
            removeToken()
            dispatch(clearUserInfo())
            dispatch(cleanTab())
            navigate('/login')
        })
    }

    const countWorkorder = async () => {
        let res = await countWorkOrderStatusApi()
        return res
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
                <div>
                    <Badge count={1}>
                        <Avatar size={40} shape="square" icon={<img src={admin}/>}/>
                    </Badge>
                    <Dropdown
                        menu={{
                            items: [{
                                label: <div
                                    onClick={() => {
                                        setChangePassVisible(true)
                                        editForm.resetFields()  // 重置编辑表单
                                    }}
                                >修改密码</div>,
                                key: '1'
                            }]
                        }}
                        placement="bottom"
                    >
                        <span style={{marginLeft: '0.5vw'}}>{userInfo.user.nickName}</span>
                    </Dropdown>
                </div>
                <span onClick={logout} style={{cursor: 'pointer'}}>退出登录</span>
            </div>
        </div>
        {/* 修改密码 */}
        <Modal
            form={editForm}
            open={changePassVisible}
            centered={true}
            closable={true}
            onCancel={() => setChangePassVisible(false)}
            footer={false}
            title={'修改密码'}
            width={'30%'}
            className='chang-pass-modal'
        >

            <Form
                name="basic"
                labelCol={{span: 6}}
                wrapperCol={{span: 14}}
                layout="horizontal"
                onFinish={onFinish}
            >
                <Form.Item
                    label="新密码："
                    name="newpassword"
                    rules={[{
                        required: true,
                        message: '请输入新密码',
                    }, {
                        validator: (_, value) => {
                            if (value && value.length > 18) {
                                return Promise.reject(new Error('密码不得大于18字符'))
                            } else if (value && value.length < 6) {
                                return Promise.reject(new Error('密码不得小于6个字符'))
                            }
                            return Promise.resolve()
                        }
                    }]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item
                    label="确认密码："
                    name="password"
                    rules={[{
                        required: true,
                        message: '请输入确认密码',
                    }, {
                        validator: (_, value) => {
                            if (value && editForm.getFieldValue('password') !== editForm.getFieldValue('newpassword')) {
                                return Promise.reject(new Error('确认新密码填写错误'))
                            }
                            return Promise.resolve()
                        }
                    }]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item
                    wrapperCol={{offset: 10, span: 16}}
                >
                    <Button type="primary" htmlType="submit">确认修改</Button>
                </Form.Item>
            </Form>
        </Modal>

        {/*<Websocket*/}
        {/*    protocol="tcp"*/}
        {/*    url={`${http.websocketURL}websocket/globalWs?Authorization=Bearer ` + getToken()}*/}
        {/*    reconnect={true} debug={true}/>*/}
    </div>
}

export default LayoutHeader
