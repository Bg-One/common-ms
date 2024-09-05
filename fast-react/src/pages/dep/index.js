import React, {useEffect, useRef, useState} from 'react';
import {Button, Form, message, Modal} from 'antd';
import {PlusOutlined, UploadOutlined, DownloadOutlined, DeleteOutlined} from '@ant-design/icons';

import {addDeptApi, deleteDeptApi, listDeptApi, updateDeptApi} from "../../common/api/deptinfo-api";

import './index.scss'
import DeptInfoForm from "../../content/dept/dept-info";
import DeptTreeData from "../../content/dept/dept-tree-data";
import {handleTree} from "../../utils/tree-data";

const Dep = () => {
    const [deptForm] = Form.useForm();//右侧详情
    const [deptInfoForm] = Form.useForm();//弹窗
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [depList, setDepList] = useState([]);
    const [treeData, setTreeData] = useState([]);
    const [selectTreeData, setSelectTreeData] = useState([]);//
    const [selectModalTreeData, setSelectModalTreeData] = useState([]);//

    useEffect(() => {
        listDepList()
    }, [])
    //设置单位详情的上级部门列表
    useEffect(() => {
        //设置上级部门
        let parentsDeptList = depList.filter(item => item.deptGuid !== selectedKeys[0] && item.ancestors.indexOf(selectedKeys[0]) === -1);
        let selectTreeData = handleTree(parentsDeptList, "deptGuid", 'deptName');
        setSelectTreeData(selectTreeData)
        let depInfo = depList.find(item => item.deptGuid === selectedKeys[0]);
        setDeptInfoForm({...depInfo})
    }, [selectedKeys])
    //获取单位列表
    const listDepList = (obj) => {
        listDeptApi(obj).then((res) => {
            if (res.data.length !== 0) {
                let treeData = handleTree(res.data, "deptGuid", 'deptName');
                setDepList(res.data);
                setTreeData(treeData)
                //默认选择第一项，展示其基本信息
                setSelectedKeys([treeData[0].deptGuid])
                setDeptInfoForm(treeData[0])
            }
        })
    }
    //设置单位详情
    const setDeptInfoForm = (data) => {
        deptForm.setFieldsValue(data);
    }
    //新增部门
    const addDept = (values) => {
        addDeptApi(values).then(res => {
            message.success("新增成功")
            setIsModalOpen(false);
            deptInfoForm.resetFields();
            setDeptListAndTreeData();
        })
    }

    //设置树形节点数据
    const setDeptListAndTreeData = () => {
        listDeptApi().then(res => {
            let treeData = handleTree(res.data, "deptGuid", 'deptName');
            setDepList(res.data);
            setTreeData(treeData)
        })
    }


//更新部门
    const updateDept = (values) => {
        updateDeptApi({...values, 'deptGuid': selectedKeys[0]}).then(res => {
            message.success("更新成功")
            setDeptListAndTreeData();
        })

    }
    //删除
    const deleteDept = () => {
        let selectedKey = selectedKeys[0];
        if (!selectedKey) {
            message.error("请选择要删除的部门")
            return
        }
        deleteDeptApi({deptGuid: selectedKey}).then(res => {
            message.success("删除成功")
            listDepList()
        })
    }

    return (
        <div id={'sys-dep'}>
            <div className={'search-area'}>
                <div className={'btn-area'}>
                    <Button type={"primary"} icon={<PlusOutlined/>} onClick={() => {
                        setIsModalOpen(true)
                        setSelectModalTreeData(treeData)
                    }}>新增</Button>
                    <Button type={"primary"} icon={<PlusOutlined/>} onClick={() => {
                        setIsModalOpen(true)
                        let parentsDeptList = depList.filter(item => item.deptGuid === selectedKeys[0]);
                        let treeData = handleTree(parentsDeptList, "deptGuid", 'deptName');
                        setSelectModalTreeData(treeData)
                    }}>添加下级</Button>
                    <Button type={"primary"} icon={<DeleteOutlined/>} onClick={deleteDept}>删除</Button>
                    <Button type={"primary"} icon={<DownloadOutlined/>}>导入</Button>
                    <Button type={"primary"} icon={<UploadOutlined/>}>导出</Button>
                </div>
                <DeptTreeData listDepList={listDepList} selectedKeys={selectedKeys}
                              setSelectedKeys={setSelectedKeys} treeData={treeData}/>
            </div>
            <div className={'sys-dep-info'}>
                <DeptInfoForm deptForm={deptForm} selectTreeData={selectTreeData} submit={updateDept}/>
            </div>
            <Modal className={'dept-add-modal'} title="部门新增" open={isModalOpen} footer={false}
                   onCancel={() => {
                       setIsModalOpen(false)
                       deptInfoForm.resetFields()
                   }}>
                <DeptInfoForm deptForm={deptInfoForm} selectTreeData={selectModalTreeData} submit={addDept}/>
            </Modal>
        </div>

    );
};
export default Dep
