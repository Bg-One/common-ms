import TimeHeader from "../../content/weekly-report/time-header";
import WeeklyReportContent from "../../content/weekly-report/weekly-report-content";
import TinymceEditor from "../../content/tinymce";
import './index.scss'
import {Button, Checkbox, Dropdown, Form, Input, message, Modal, Radio, Select, Space} from "antd";
import worksetmenu from '../../static/images/worksetmenu.png'
import worksetadd from '../../static/images/worksetadd.png'
import worksetmore from '../../static/images/woeksetmore.png'
import {useEffect, useState} from "react";
import {listAllProjectApi, listProjectApi} from "../../common/api/producems/project";
import {listUserByDeptApi} from "../../common/api/sys/user-api";
import {useSelector} from "react-redux";
import {
    addOrEditWeeklyReportDetailApi,
    addWeeklyReportApi,
    delWeeklyReportApi, getWeeklyReporterSetDetailApi,
    listWeeklyReporterSetApi, updateWeeklyReportApi
} from "../../common/api/producems/weekly-report";
import {listAllProduceApi} from "../../common/api/producems/produce";
import dayjs from "dayjs";
import {getWeekEndDate, getWeekFirstDate} from "../../utils/date";
import {checkChanges, deepCopy} from "../../utils/table";


const {confirm} = Modal;
const DeptWeeklyReport = () => {
    const [currentDateStr, setCurrentDateStr] = useState(dayjs().format('YYYY-MM-DD'))
    let [weeklyReportForm] = Form.useForm();
    const userInfo = useSelector(state => state.user.userInfo)
    const [projectList, setProjectList] = useState([])
    const [produceList, setProduceList] = useState([])
    const [userList, setUserList] = useState([])
    const [workset, setWorkset] = useState([])
    const [addWeeklySetModal, setAddWeeklySetModal] = useState(false)
    const [weeklySetType, setWeeklySetType] = useState(1)
    const [selectedWeeklySetGuid, setSelectedWeeklySetGuid] = useState('')
    const [hideFlag, setHideFlag] = useState(0)
    const [actionType, setActionType] = useState('add')
    const [workContentList, setWorkContentList] = useState([])
    const [workPlanList, setWorkPlanList] = useState([])
    const [iniData, setIniData] = useState({})
    const [loading, setLoading] = useState(true)

    const [planContent, setPlanContent] = useState('')
    const [questionContent, setQuestionContent] = useState('')

    useEffect(() => {
        listProject()
        listUserListByDept()
        listProduce()
    }, [])
    useEffect(() => {
        listWorkset()
    }, [hideFlag])
    useEffect(() => {
        if (selectedWeeklySetGuid !== undefined && selectedWeeklySetGuid === '') {
            return
        }
        getWeeklySetDetailContent(selectedWeeklySetGuid)
    }, [selectedWeeklySetGuid])
    const listUserListByDept = async () => {
        let res = await listUserByDeptApi({deptGuid: '90bedad1-b8c6-4ad4-b123-7872e0849a09'})
        setUserList(res.data)
    }
    const listProject = async () => {
        let res = await listAllProjectApi()
        setProjectList(res.data)
    }
    const listProduce = async () => {
        let res = await listAllProduceApi()
        setProduceList(res.data)
    }
    const listWorkset = async () => {
        let res = await listWeeklyReporterSetApi({
            deptGuid: '90bedad1-b8c6-4ad4-b123-7872e0849a09',
            startTime: getWeekFirstDate(currentDateStr, "YYYY-MM-DD 00:00:00"),
            endTime: getWeekEndDate(currentDateStr, "YYYY-MM-DD 23:59:59"),
            hideFlag: hideFlag,
        })
        setWorkset(res.data)
        setSelectedWeeklySetGuid(res.data[0]?.guid)
    }
    //打开工作集编辑弹窗
    const openAddWeeklySetModal = async (type) => {
        setAddWeeklySetModal(true)
        setActionType(type)
    }
    //新增工作集
    const addWeeklySet = async (values) => {
        await addWeeklyReportApi({
            deptGuid: '90bedad1-b8c6-4ad4-b123-7872e0849a09',
            name: values.name,
            projectGuids: values.projectGuids ? values.projectGuids.join(',') : '',
            produceGuid: values.produceGuid ? values.produceGuid : '',
            managerGuids: values.managerGuids ? values.managerGuids.join(',') : '',
            weeklyReportType: weeklySetType
        })
        listWorkset()
        message.success("保存成功")
        setAddWeeklySetModal(false)
    }
    //编辑工作集
    const editWeeklySet = async (type) => {
        let weekly = workset.find(item => item.guid === selectedWeeklySetGuid);
        weeklyReportForm.setFieldsValue({...weekly})
        weeklyReportForm.setFieldValue('projectGuids', weekly.projectGuids.split(','))
        weeklyReportForm.setFieldValue('managerGuids', weekly.managerGuids.split(','))
        setWeeklySetType(weekly.weeklyReportType)
        setAddWeeklySetModal(true)
        setActionType(type)
    }
    //更新工作集
    const updateWeeklySet = async () => {
        const fieldsValue = weeklyReportForm.getFieldsValue();
        let reqBody = {
            guid: selectedWeeklySetGuid,
            name: fieldsValue.name,
            projectGuids: fieldsValue.projectGuids ? fieldsValue.projectGuids.join(',') : '',
            produceGuid: fieldsValue.produceGuid ? fieldsValue.produceGuid : '',
            managerGuids: fieldsValue.managerGuids ? fieldsValue.managerGuids.join(',') : '',
            hideFlag: -1
        }
        await updateWeeklyReportApi(reqBody)
        listWorkset()
        message.success("更新成功")
        setAddWeeklySetModal(false)
    }
    //隐藏/取消隐藏工作集
    const hideWeeklySet = async (hideFlag) => {
        let reqBody = {
            guid: selectedWeeklySetGuid,
            hideFlag: hideFlag
        }
        await updateWeeklyReportApi(reqBody)
        listWorkset()
        message.success("更新成功")
    }
    //保存工作集详情
    const saveWeeklySetContent = async () => {
        let changesContent = checkChanges(iniData.workContentList, workContentList, 'guid')
        let changesPlan = checkChanges(iniData.planContentList, workPlanList, 'guid')
        let changesArr = [...changesContent.addArr, ...changesContent.changeArr, ...changesPlan.addArr, ...changesPlan.changeArr]
        let reqBody = {
            questionContent: questionContent,
            planContent: planContent,
            guid: selectedWeeklySetGuid,
            hideFlag: -1
        }
        if (changesArr.length !== 0) {
            reqBody.weeklyReportDetailJson = JSON.stringify(changesArr)
        }
        await addOrEditWeeklyReportDetailApi(reqBody)
        message.success('保存成功')
    }
    //新增一条工作记录、计划
    const addWorkItem = (dateList, type) => {
        dateList.push({
            content: '',
            weeklyDetailType: type,
            progress: 0,
            managerGuid: '',
            weeklyReportGuid: selectedWeeklySetGuid,
        })
    }
    //获取工作集详情
    const getWeeklySetDetailContent = async (guid) => {
        setLoading(true)
        let res = await getWeeklyReporterSetDetailApi({guid: guid})
        setPlanContent(res.data.planContent)
        setQuestionContent(res.data.questionContent)
        let contentType = 0;
        let planType = 1;
        let workContentList = []
        let workPlanList = []
        res.data.weeklyReportDetailList.forEach(item => {
            if (item.type === contentType) {
                workContentList.push(item)
            } else if (item.type === planType) {
                workPlanList.push(item)
            }
        })
        addWorkItem(workContentList, contentType)
        addWorkItem(workPlanList, planType)
        setWorkContentList(deepCopy(workContentList))
        setWorkPlanList(deepCopy(workPlanList))
        setIniData({
            workContentList: deepCopy(workContentList),
            planContentList: deepCopy(workPlanList),
            questionContent: res.data.questionContent,
            planContent: res.data.planContent
        })
        setLoading(false)
        setSelectedWeeklySetGuid(guid)
    }
    //切换工作集详情
    const switchWeeklySet = async (guid) => {
        //判断是否保存过
        let changesContent = checkChanges(iniData.workContentList, workContentList, 'guid')
        let changesPlan = checkChanges(iniData.planContentList, workPlanList, 'guid')
        let changesArr = [...changesContent.addArr, ...changesContent.changeArr, ...changesPlan.addArr, ...changesPlan.changeArr]
        if (changesArr.length !== 0 || iniData.planContent !== planContent || iniData.questionContent !== questionContent) {
            await new Promise(async (resolve, reject) => {
                confirm({
                    title: '保存提醒',
                    content: '有未保存的内容是否保存？',
                    async onOk() {
                        saveWeeklySetContent().then(
                            () => resolve()
                        ).catch(
                            () => reject('取消操作')
                        )
                    },
                    onCancel() {
                        reject('取消操作')
                    },
                })
            })
        }
        setSelectedWeeklySetGuid(guid)
    }
    return <div id={'dept-weekly-report'}>
        <TimeHeader currentDateStr={currentDateStr} setCurrentDateStr={setCurrentDateStr}
                    saveWeeklySetContent={saveWeeklySetContent}/>
        <div className={'content'}>
            <div className={'direct'}>
                <div className={'direct-title'}>工作集</div>
                <div className={'workset'}>
                    {
                        workset.map((item) => {
                            return <div
                                onClick={() => {
                                    switchWeeklySet(item.guid)
                                }}
                                key={item.guid}
                                className={'workset-item'}
                                style={{backgroundColor: selectedWeeklySetGuid === item.guid ? 'skyblue' : '#ffffff'}}>
                                <span>
                                    {item.name}
                                </span>
                                <Dropdown
                                    menu={{
                                        items: [{
                                            label: <span onClick={() => {
                                                editWeeklySet('look')
                                            }}>查看详情</span>,
                                            key: '0',
                                        }, {
                                            label: <span onClick={() => {
                                                editWeeklySet('edit')
                                            }}>修改</span>,
                                            key: '1',
                                        }, {
                                            label: item.hideFlag ? <span onClick={() => {
                                                hideWeeklySet(0)
                                            }}>取消隐藏</span> : <span onClick={() => {
                                                hideWeeklySet(1)
                                            }}>隐藏</span>,
                                            key: '2',
                                        }, {
                                            label: <span onClick={() => {
                                                confirm({
                                                    title: '删除提醒',
                                                    content: '是否删除此工作集',
                                                    async onOk() {
                                                        delWeeklyReportApi({guid: selectedWeeklySetGuid}).then(() => {
                                                                listWorkset()
                                                                message.success('删除成功')
                                                            }
                                                        )
                                                    },
                                                    onCancel() {
                                                    },
                                                });
                                            }}>删除</span>,
                                            key: '3',
                                        }]
                                    }}
                                    trigger={['click']}
                                >
                                    <img src={worksetmore}/>
                                </Dropdown>
                            </div>
                        })
                    }
                </div>
                <div style={{textAlign: 'center'}}>
                    <Checkbox style={{borderBottom: '1px solid', marginBottom: '1vh'}} checked={hideFlag}
                              onChange={(e) => setHideFlag(e.target.checked ? 1 : 0)}>显示隐藏工作集</Checkbox>
                </div>
                <div onClick={() => {
                    openAddWeeklySetModal('add')
                }} className={'add-workset'}><img src={worksetadd}/>新增工作集
                </div>
            </div>
            {
                loading ? <span className={'direct-content'}>loading...</span> : <div className={'direct-content'}>
                    <span className={'weekly-title-span'}>工作集计划<img src={worksetmenu}/></span>
                    <TinymceEditor id={'workPlan'} height={'20vh'}
                                   data={planContent}
                                   func={(data) => {
                                       setPlanContent(data)
                                   }}/>
                    <WeeklyReportContent type={'work'} setDateSource={setWorkContentList} dateSource={workContentList}
                                         userList={userList} addWorkItem={addWorkItem}/>
                    <WeeklyReportContent type={'plan'} setDateSource={setWorkPlanList} dateSource={workPlanList}
                                         userList={userList} addWorkItem={addWorkItem}/>
                    <span className={'weekly-title-span'}>存在问题<img src={worksetmenu}/></span>
                    <TinymceEditor id={'workQuestion'} height={'20vh'}
                                   data={questionContent}
                                   func={(data) => {
                                       setQuestionContent(data)
                                   }}/>
                </div>
            }
        </div>
        <Modal
            open={addWeeklySetModal}
            onCancel={() => setAddWeeklySetModal(false)}
            footer={false}
            title={'新增工作集'}
            centered={true}
            className={'weekly-modal'}
        >
            <div style={{textAlign: 'center', margin: '1vh 0'}}>
                <Radio.Group disabled={actionType !== 'add'} onChange={e => setWeeklySetType(e.target.value)}
                             value={weeklySetType}>
                    <Radio value={1}>项目</Radio>
                    <Radio value={0}>产品</Radio>
                </Radio.Group>
            </div>
            <Form
                form={weeklyReportForm}
                layout="horizontal"
                labelCol={{span: 5,}}
                disabled={actionType !== 'add' && actionType !== 'edit'}
                autoComplete="off"
            ><Form.Item label={'工作集名称'} name={'name'} rules={[
                {
                    required: true,
                    message: '请输入工作集名称',
                },
            ]}>
                <Input/>
            </Form.Item>
                {
                    weeklySetType === 1 ? <Form.Item label={'选择项目'} name={'projectGuids'} rules={[
                        {
                            required: true,
                            message: '请选择项目',
                        },
                    ]}>
                        <Select
                            mode="multiple"
                            options={projectList.map(item => {
                                return {
                                    value: item.guid,
                                    label: item.name
                                }
                            })}
                        />
                    </Form.Item> : <Form.Item label={'选择产品'} rules={[
                        {
                            required: true,
                            message: '请选择产品',
                        },
                    ]}>
                        <Select
                            options={produceList.map(item => {
                                return {
                                    value: item.guid,
                                    label: item.name
                                }
                            })}
                        />
                    </Form.Item>
                }
                <Form.Item label={'负责人'} name={'managerGuids'} rules={[
                    {
                        required: true,
                        message: '请选择负责人',
                    },
                ]}>
                    <Select
                        mode="multiple"
                        options={userList.map(item => {
                            return {
                                value: item.userGuid,
                                label: item.nickName
                            }
                        })}
                    />
                </Form.Item>
            </Form>
            <div style={{textAlign: 'center'}}>
                <Button type={'primary'} onClick={() => setAddWeeklySetModal(false)}>取消</Button>
                <Button type={'primary'} onClick={actionType === 'add' ? addWeeklySet : updateWeeklySet}>确定</Button>
            </div>
        </Modal>
    </div>
}

export default DeptWeeklyReport
