import {Button, Checkbox, Form, Image, Input, message} from 'antd';
import {useEffect, useState} from 'react';
import {sm3} from "sm-crypto";
import {loginApi, captchaImageApi} from '../../common/api/sys/sys-api';
import './index.scss'
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setAuthentication} from "../../redux/user/user-slice";
import {setToken} from "../../utils/auth";
import loginsign from '../../static/images/login-sign.png'
import loginUser from '../../static/images/login-user.png'
import loginpassword from '../../static/images/login-password.png'

const Login = (props) => {
    let navigate = useNavigate();
    let dispatch = useDispatch();
    const [loading, setLoadings] = useState(false);
    useEffect(() => {
        getCaptchaImage()
    }, [])
    //图文验证码
    const [captchaImage, setCaptchaImage] = useState('')
    //图文唯一标识
    const [uuid, setUuid] = useState('')

    //获取验证码
    const getCaptchaImage = async () => {
        let res = await captchaImageApi()
        setCaptchaImage('data:image/png;base64,' + res.data.img)
        setUuid(res.data.uuid)
    }

    // 登录
    let onFinish = (values) => {
        setLoadings(true)
        loginApi({...values, uuid, password: sm3(values.password)}).then(res => {
            setToken(res.data.access_token)
            setLoadings(false)
            dispatch(setAuthentication(true))
            navigate('/home/index')
        }).catch(() => {
            getCaptchaImage()
            setLoadings(false)
        });

    }

    return <div id='login'>
        <div className={'login-form'}>
            <img className="login-item" src={loginsign}/>
            <div className="login-item login-title">生产管控平台</div>
            <Form
                name="basic"
                initialValues={{remember: true}}
                onFinish={onFinish}
                autoComplete="off"
                labelCol={{
                    span: 4,
                }}
            >
                <Form.Item
                    name="userName"
                    rules={[
                        {
                            required: true,
                            message: '请输入用户名!',
                        },
                    ]}
                >
                    <Input prefix={<img src={loginUser}/>} className={'login-item'} placeholder='请输入用户名'/>
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: '请输入密码!',
                        },
                    ]}
                >
                    <Input.Password prefix={<img src={loginpassword}/>} placeholder='请输入密码'/>
                </Form.Item>
                <Form.Item
                    className={'captcha-form-item'}
                    name="code"
                    rules={[
                        {
                            required: true,
                            message: '请输入图文验证码!',
                        },
                    ]}
                >
                    <Input placeholder='请输入图文验证码'/>
                </Form.Item>
                <img src={captchaImage} style={{width: '5vw'}} onClick={getCaptchaImage}/>
                <Form.Item>
                    <Button htmlType="submit" className={'login-btn'} type={'primary'} loading={loading}>
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </div>

    </div>
}

export default Login
