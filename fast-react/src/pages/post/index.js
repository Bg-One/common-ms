import {Button, Form, Input, message, Popconfirm, Select, Space, Table} from "antd";
import {DownloadOutlined, PlusOutlined, ReloadOutlined, SearchOutlined, UploadOutlined} from "@ant-design/icons";

import React, {useEffect, useState} from "react";
import {useForm} from "antd/es/form/Form";
import './index.scss'

import {addPostApi, delPostApi, editPostApi, listPostApi} from "../../common/api/sys/post-api";
import PostInfoDrawer from "../../content/post/post-info-drawer";

const Post = (props) => {
    const [searchForm] = useForm();//
    const [postInfoform] = useForm();
    const [postList, setPostList] = useState([])
    const [open, setOpen] = useState(false);
    const [selectPost, setSelectPost] = useState({})
    useEffect(() => {
        getPostList()
    }, [])

    //获取岗位列表
    const getPostList = (obj = {}) => {
        listPostApi(obj).then(res => {
            setPostList(res.data)
        })
    }

    //查询
    const onSearch = (values) => {
        getPostList(values)
    };
    //删除岗位
    const deletePost = (obj) => {
        delPostApi({postGuids: obj.postGuid}).then(res => {
            message.success('删除成功')
            getPostList(searchForm.getFieldsValue())
        })
    }

    //关闭岗位信息抽屉
    const closeUserInfoDrawer = () => {
        postInfoform.resetFields()
        setOpen(false)
        setSelectPost({})
    }

    //编辑岗位
    const editPost = (values) => {
        editPostApi({...values, postGuid: selectPost.postGuid}).then(() => {
            message.success('编辑成功')
            postInfoform.resetFields()
            setSelectPost({})
            setOpen(false)
            getPostList(searchForm.getFieldsValue())
        })
    }
    //新增岗位
    const addPost = (values) => {
        addPostApi({...values}).then(res => {
            message.success('新增成功')
            postInfoform.resetFields()
            setOpen(false)
            getPostList(searchForm.getFieldsValue())
        })

    }

    return <div id={'sys-post'}>
        <div className={'search-area'}>
            <Form
                className={'search-form'}
                form={searchForm}
                name="basic"
                layout="inline"
                labelCol={{
                    span: 6,
                }}
                onFinish={onSearch}
                autoComplete="off"
            >
                <Form.Item
                    label="岗位名称"
                    name="postName"
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="岗位编码"
                    name="postCode"
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="状态"
                    name="status"
                    labelCol={{
                        span: 10,
                    }}
                >
                    <Select
                        options={[
                            {
                                value: '0',
                                label: '禁用',
                            },
                            {
                                value: '1',
                                label: '启用',
                            },
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        span: 10,
                        offset: 10,
                    }}>
                    <Space>
                        <Button type="primary" htmlType="submit" icon={<SearchOutlined/>}>
                            查询
                        </Button>
                        <Button htmlType="button" icon={<ReloadOutlined/>} onClick={() => {
                            searchForm.resetFields()
                            getPostList({})
                        }}>
                            重置
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
        <div className={'btn-area'}>
            <Button type={"primary"} icon={<PlusOutlined/>} onClick={() => {
                setOpen(true)
            }}>新增</Button>
            <Button type={"primary"} icon={<DownloadOutlined/>}>导入</Button>
            <Button type={"primary"} icon={<UploadOutlined/>}>导出</Button>
        </div>
        <Table
            rowKey={record => record.postGuid}
            dataSource={postList}
            columns={[
                {
                    title: '序号',
                    width: '5vw',
                    render: (text, record, index) => {
                        return index + 1
                    },
                },
                {
                    title: '岗位名',
                    dataIndex: 'postName',
                    key: 'postName',
                },
                {
                    title: '岗位编码',
                    dataIndex: 'postCode',
                    key: 'postCode',
                },
                {
                    title: '排序',
                    dataIndex: 'postSort',
                    key: 'postSort',
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    width: '30vw'
                },
                {
                    title: '操作',
                    width: '10vw',
                    render: (text, record, index) => {
                        return <div>
                            <Button type={'link'} onClick={() => {
                                postInfoform.setFieldsValue(record)
                                setOpen(true)
                                setSelectPost(record)
                            }}>编辑</Button>
                            <Popconfirm
                                title="删除提醒"
                                description="您确定删除该岗位吗？"
                                onConfirm={() => {
                                    deletePost(record)
                                }}
                                okText="确定"
                                cancelText="取消"
                            >
                                <Button type={'link'}>删除</Button>
                            </Popconfirm>
                        </div>
                    },
                }]}
        />
        <PostInfoDrawer
            open={open}
            closeUserInfoDrawer={closeUserInfoDrawer}
            userAction={Object.keys(selectPost).length !== 0 ? editPost : addPost}
            form={postInfoform}
        />

    </div>
}
export default Post;
