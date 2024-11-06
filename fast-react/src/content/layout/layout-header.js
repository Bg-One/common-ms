import './layout-header.scss'

import {useNavigate} from "react-router-dom";
import {Badge, Button, Checkbox, Dropdown, Form, Input, message, Modal, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {logoutApi} from "../../common/api/sys/sys-api";
import {changeMenuConfig, clearUserInfo} from "../../redux/user/user-slice";
import {getToken, removeToken} from "../../utils/auth";
import http from "../../utils/http";
import {useEffect, useState} from "react";
import useWebSocket from "../../common/usehooks/useHooks";
import admin from '../../static/images/admin.png'
import bellred from '../../static/images/bell-red.png'
import bellgreen from '../../static/images/bell-green.png'
import {cleanTab} from "../../redux/tab/tab-slice";
import {resetPwdApi} from "../../common/api/sys/user-api";
import {sm3} from "sm-crypto";
import {deepCopy} from "../../utils/table";
import {countWorkOrderStatusApi} from "../../common/api/producems/workorder";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import LayoutBreadCrum from "./layout-breadCrum";
import {listMessageAlertsApi, updateMessageReadFalgApi} from "../../common/api/producems/message";
import {messageEnum} from "../../common/enmus/message-enum";
import {alertTypeEnum} from "../../common/enmus/alerttype-enum";

const {confirm} = Modal;

const LayoutHeader = ({toggleCollapsed, collapsed}) => {
    const [editForm] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [changePassVisible, setChangePassVisible] = useState(false)
    const userInfo = useSelector(state => state.user.userInfo);
    const menuConfig = useSelector(state => state.user.menuConfig);
    const [whetherConfirmFlag, setWhetherConfirmFlag] = useState(false)
    const [messageAlertList, setMessageAlertList] = useState([])
    const [messageAlertVisible, setMessageAlertVisible] = useState(false)
    const [readFlag, setReadFlag] = useState(true)
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1, pageSize: 10, total: 0, totalPages: 0
    })
    const {
        data,
        sendMessage
    } = useWebSocket(`${http.websocketURL}websocket/globalWs?Authorization=Bearer ` + getToken());

    useEffect(() => {
            iniWorkorderCount()
        }, []
    )
    useEffect(() => {
            listMessageAlert({
                currentPage: pageInfo.currentPage,
                pageSize: pageInfo.pageSize,
                readFlag: readFlag ? 1 : 0
            })
        }, [readFlag]
    )
    const iniWorkorderCount = () => {
        countWorkorder().then((res) => {
            let deepCopyMenuConfig = deepCopy(menuConfig);
            for (const ele of deepCopyMenuConfig) {
                if (ele.key === '/home/order') {
                    for (const eleChild of ele.children) {
                        let label = eleChild.label
                        if (eleChild.key === '/home/order/work-submit') {
                            label = <span>{eleChild.label}
                                {res.data.waitSubmitCount ? <Badge count={res.data.waitSubmitCount} color={"orange"} style={{marginLeft: '1vw'}}/> : ''}
                                {res.data.checkFaildCount ? <Badge count={res.data.checkFaildCount}/> : ''}
                            </span>
                        } else if (eleChild.key === '/home/order/work-wait-checked') {
                            label = <span>{eleChild.label}
                                {res.data.waitCheckCount ? <Badge count={res.data.waitCheckCount} style={{marginLeft: '1vw'}} color={"orange"}/> : ''}</span>
                        } else if (eleChild.key === '/home/order/work-submit') {
                            label = <span>{eleChild.label} {res.data.checkCount ?
                                <Badge count={res.data.checkCount} style={{marginLeft: '1vw'}} color={"orange"}/> : ''}</span>
                        }
                        eleChild.label = label
                    }
                }
            }
            dispatch(changeMenuConfig(deepCopyMenuConfig))
        })
    }

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
            navigate('/login')
        })
    }

    const countWorkorder = async () => {
        return await countWorkOrderStatusApi()
    }
    const listMessageAlert = async (values) => {
        let res = await listMessageAlertsApi({...values})
        setMessageAlertList(res.data.list)
        setPageInfo({
            currentPage: res.data.currentPage,
            pageSize: res.data.pageSize,
            total: res.data.total,
            totalPages: res.data.totalPages
        })
        whetherConfirmMessage()
    }
    //判断是否有未确认的消息
    const whetherConfirmMessage = () => {
        let whetherConfirmFlag = messageAlertList.some(item => item.readFlag === messageEnum.NOREAD)
        setWhetherConfirmFlag(whetherConfirmFlag)
    }

    //编辑消息提示为已读
    const editReadFlag = (record) => {
        updateMessageReadFalgApi({
            messageGuid: record.guid,
        }).then(data => {
            listMessageAlert({
                currentPage: pageInfo.currentPage,
                pageSize: pageInfo.pageSize,
                readFlag: readFlag ? 1 : 0
            })
        })
    }
    return <div id={"layout-header"}>
        <div className="layout-header-content">
            <div>
                <Button
                    type="primary"
                    onClick={toggleCollapsed}
                    style={{marginBottom: 16,}}
                >{collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}</Button>
                <LayoutBreadCrum/>
            </div>
            <div className={"layout-header-user"}>
                <div>
                    <img src={admin} style={{width: '2vw', verticalAlign: 'middle'}}/>
                    <Dropdown
                        style={{verticalAlign: 'middle'}}
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
                    <img
                        className={(whetherConfirmFlag ? 'bell-active' : 'bell')}
                        src={whetherConfirmFlag ? bellred : bellgreen}
                        onClick={() => {
                            setMessageAlertVisible(true)
                        }}/>
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
                <Form.Item wrapperCol={{offset: 10, span: 16}}>
                    <Button type="primary" htmlType="submit">确认修改</Button>
                </Form.Item>
            </Form>
        </Modal>

        {/* 提醒 */}
        <Modal
            open={messageAlertVisible}
            centered={true}
            closable={true}
            onCancel={e => setMessageAlertVisible(false)}
            footer={false}
            title={false}
            width={'70%'}
            className='message-alert'
        >
            <Checkbox checked={readFlag} onChange={(e) => setReadFlag(e.target.checked)}>屏蔽已读提醒</Checkbox>
            <Table
                columns={[
                    {
                        title: '序号',
                        render: (text, record, index) => {
                            return <div>{index + 1}</div>
                        }
                    }, {
                        title: '产品编号',
                        dataIndex: 'produceNo',
                        key: 'produceNo'
                    }, {
                        title: '产品名称',
                        dataIndex: 'produceName',
                        key: 'produceName'
                    }, {
                        title: '提醒类型',
                        dataIndex: 'alertType',
                        key: 'alertType',
                        render: (text, record, index) => {
                            return alertTypeEnum.getName(record.alertType)
                        }
                    }, {
                        title: '需求描述',
                        dataIndex: 'contentDescription',
                        key: 'contentDescription'
                    }, {
                        title: '提醒时间',
                        dataIndex: 'createTime',
                        key: 'createTime',
                    }, {
                        title: '操作',
                        key: 'action',
                        render: (text, record, index) => {
                            return <div className='actionlist'>
                                {record.readFlag ? <span>已读</span> : <Button onClick={() => {
                                    editReadFlag(record)
                                }}>确认</Button>}
                            </div>
                        }
                    }]}
                dataSource={messageAlertList}
                rowKey={record => record.guid}
                pagination={{
                    pageSize: pageInfo.pageSize,
                    pageNumber: pageInfo.currentPage,
                    total: pageInfo.total,
                    showSizeChanger: true,
                    onChange: (page, pageSize) => {
                        listMessageAlert({
                            currentPage: pageInfo.currentPage,
                            pageSize: pageInfo.pageSize,
                            readFlag: readFlag ? 1 : 0
                        })
                    }
                }}
            />
        </Modal>
    </div>
}

export default LayoutHeader
