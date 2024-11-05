import React, {useEffect, useRef, useState} from "react";
import './index.scss'
import TreeSearch from "../../content/demand-tree-search/tree-search";
import {
    getDemandApi,
    getDetailDesignApi,
    getNodesApi,
    listNodesApi,
    updateDemandApi
} from "../../common/api/producems/demand";
import {deepCopy, deepEqual} from "../../utils/table";
import {createTreeItem, getObjByConditon, handleTree} from "../../utils/tree-data";
import file from "../../static/images/file.png";
import {useSearchParams} from "react-router-dom";
import Objective from "../../content/demand-node/objective";
import Reader from "../../content/demand-node/reader";
import DemandTerm from "../../content/demand-node/demand-term";
import UserFunc from "../../content/demand-node/user-func";
import QuestionConfirmed from "../../content/demand-node/question-confirmed";
import RightMenu from "../../content/right-menu/right-menu";
import DemandItemContent from "../../content/demand-node/demand-item-content";
import SoftDetaildesign from "../../content/demand-node/soft-detaildesign";
import {Form, message, Modal, Tabs} from "antd";
import {useSelector} from "react-redux";
import {hasRoleOr} from "../../utils/permi";
import {documentEnum} from "../../common/enmus/document-enum";

const DemandEdit = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [nodeList, setNodeList] = useState([])
    const [treeData, setTreeData] = useState([])
    const [activeNode, setActiveNode] = useState('')
    const [classType, setClassType] = useState(documentEnum.DEMAND)
    const [nodeOrder, setNodeOrder] = useState(0)
    const [parentNodeGuid, setParentNodeGuid] = useState('')

    const [pageX, setPageX] = useState(0);
    const [pageY, setPageY] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const dropdownElement = useRef(null);
    const [demandManage, setDemandManage] = useState({objective: '', reader: ''})
    const [demandVisible, setDemandVisible] = useState(false)
    const [demandItem, setDemandItem] = useState({})
    const [softDesignDetail, setSoftDesignDetail] = useState({})
    const [demandItemForm] = Form.useForm()
    const [softDesignForm] = Form.useForm()
    let userInfo = useSelector(state => state.user.userInfo);


    // beforeunload 事件处理函数
    const handleBeforeUnload = (event) => {
        // 设置自定义的离开提示信息（某些浏览器可能忽略自定义信息，只显示默认信息）
        event.preventDefault();
        event.returnValue = ''; // 设置 returnValue 可以触发浏览器的默认离开提示

    };

    useEffect(() => {
        // 添加 beforeunload 事件监听器
        window.addEventListener('beforeunload', handleBeforeUnload);
        // 清理函数：移除 beforeunload 事件监听器
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        listNodes()
        getDemandDetil()
    }, [])

    useEffect(() => {
        focusDropdown();
    }, [showMenu]);


    //获取需求节点的软件设计、需求设计
    const getDemandItemDetail = async (eElement) => {
        //获取节点信息
        let response = await getNodesApi({guid: eElement})
        setDemandItem(deepCopy(response.data))
        let res = await getDetailDesignApi({nodeGuid: eElement})
        setSoftDesignDetail(deepCopy(res.data))
        setTimeout(() => {
            setDemandVisible(true)
        }, 200)

    }

    //获取需求信息
    const getDemandDetil = async () => {
        let res = await getDemandApi({guid: searchParams.get('demandGuid')})
        setDemandManage({
            objective: res.data.objective,
            reader: res.data.reader
        })
    }
    //保存需求信息
    const saveDemand = async (data) => {
        await updateDemandApi({
            ...demandManage,
            guid: searchParams.get('demandGuid')
        })
        message.success('保存成功', 1)
    }
    //获取功能菜单
    const listNodes = () => {
        listNodesApi({
            produceGuid: searchParams.get("produceGuid")
        }).then(res => {
            setNodeList([...deepCopy(res.data),
                {guid: 'objective', name: '目的'},
                {guid: 'reader', name: '读者对象'},
                {guid: 'demandTerm', name: '术语'},
                {guid: 'userFunc', name: '用户功能列表'},
                {guid: 'func-demand', name: '功能需求'},
                {guid: 'nofunc-demand', name: '非功能需求'},
                {guid: 'question-confirmed', name: '待确认问题列表'}
            ])
            let oldNodeList = deepCopy(res.data)
            let handleTreeData = handleTree(oldNodeList, "guid", 'name', 'parentNodeGuid');
            let newFuncNodeList = createFuncDemandNode(handleTreeData, 1)
            let newNoFuncNodeList = createFuncDemandNode(handleTreeData, 2)
            //属性结构数据
            let treeData = [
                createTreeItem('目的', 'objective', <img src={file} className={'demand-item'}/>),
                createTreeItem('读者对象', 'reader', <img src={file} className={'demand-item'}/>),
                createTreeItem('术语', 'demandTerm', <img src={file} className={'demand-item'}/>),
                createTreeItem('用户功能列表', 'userFunc', <img src={file} className={'demand-item'}/>),
                createTreeItem('功能需求', 'func-demand', <img src={file} className={'demand-item'}/>, newFuncNodeList),
                createTreeItem('非功能需求', 'nofunc-demand', <img src={file}
                                                                   className={'demand-item'}/>, newNoFuncNodeList),
                createTreeItem('待确认问题列表', 'question-confirmed', <img src={file} className={'demand-item'}/>),
            ];
            setTreeData(treeData)
        })
    }
    //创建需求节点
    const createFuncDemandNode = (item, classType) => {
        let newNodeList = []
        item.forEach((i) => {
            if (i.classType === classType) {
                newNodeList.push(createTreeItem(i.name, i.guid, '', i.children ? createFuncDemandNode(i.children, classType) : ''))
            }
        })
        return newNodeList;
    }
    //右键事件
    const handleRightClick = ({event, node}) => {
        event.stopPropagation();
        setPageX(event.pageX);
        setPageY(event.pageY);
        setShowMenu(true);
        let demandFlag = (node.key === 'func-demand' || node.key === 'nofunc-demand')
        setParentNodeGuid(demandFlag ? '' : node.key);
        setNodeOrder(demandFlag ? 1 : getNodeOrder(nodeList, node) + 1)
        setClassType(demandFlag || getObjByConditon(nodeList, item => item.guid === node.key).classType === documentEnum.DEMAND ?
            documentEnum.DEMAND : documentEnum.NO_FUNC_DEMAND)
    };
    //获取该节点下子节点最后的顺序编号
    const getNodeOrder = (data, node) => {
        let obj = getObjByConditon(nodeList, item => item.guid === node.key)
        let lastArr = obj.child[obj.child.length - 1]
        return lastArr ? lastArr.nodeOrder : 0
    }

    //聚焦
    const focusDropdown = () => {
        if (dropdownElement.current) {
            dropdownElement.current?.focus();
        }
    };
    //渲染菜单
    const renderMenu = () => {
        if (pageX && pageY) {
            return (
                <div
                    tabIndex={-1}
                    style={{
                        display: showMenu ? 'inherit' : 'none',
                        position: 'fixed',
                        left: pageX - 16,
                        top: pageY + 8,
                    }}
                    ref={dropdownElement}
                    onBlur={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                    }}
                >
                    <RightMenu nodeGuid={activeNode} classType={classType} parentNodeGuid={parentNodeGuid}
                               moduleGuid={searchParams.get('demandGuid')} nodeOrder={nodeOrder} listNodes={listNodes}/>
                </div>
            );
        }
        return null;
    };
    return <div id={'demand-edit'}>
        <div className="demand-item-container">
            <div className={'title'}>需求规格说明目录</div>
            <TreeSearch
                onSelect={(e, name) => {
                    let eElement = e[0];
                    setActiveNode(eElement)
                    //判断是否显示需求节点面板
                    if (eElement === 'objective' || eElement === 'demandTerm'
                        || eElement === 'userFunc' || eElement === 'func-demand'
                        || eElement === 'nofunc-demand' || eElement === 'question-confirmed') {
                        return
                    }
                    setDemandVisible(false)
                    let obj = nodeList.find(item => item.guid === eElement);
                    obj && obj.nodeType && getDemandItemDetail(eElement)
                }}
                defaultData={treeData}
                dataList={nodeList}
                handleRightClick={handleRightClick}
            />
            {hasRoleOr(userInfo, ['pro:dept:user', 'pro:dept:manager']) ? renderMenu() : ''}
        </div>
        <div className={'demand-content-container'}>
            {
                activeNode === 'objective' ?
                    <Objective demandManage={demandManage} setDemandManage={setDemandManage} saveDemand={saveDemand}/> :
                    activeNode === 'reader' ? <Reader demandManage={demandManage} setDemandManage={setDemandManage}
                                                      saveDemand={saveDemand}/> :
                        activeNode === 'demandTerm' ? <DemandTerm/> :
                            activeNode === 'userFunc' ? <UserFunc/> :
                                activeNode === 'question-confirmed' ? <QuestionConfirmed/> :
                                    demandVisible ?
                                        <Tabs defaultActiveKey="1" items={[
                                            {
                                                key: '1',
                                                label: '需求功能设计',
                                                children: <DemandItemContent
                                                    demandItem={{...demandItem, nodeGuid: activeNode}}
                                                    setDemandItem={setDemandItem}
                                                    demandItemForm={demandItemForm}/>,
                                            },
                                            {
                                                key: '2',
                                                label: '开发详细设计',
                                                children: <SoftDetaildesign
                                                    softDesignDetail={{...softDesignDetail, nodeGuid: activeNode}}
                                                    setSoftDesignDetail={setSoftDesignDetail}
                                                    softDesignForm={softDesignForm}/>,
                                            }]}/> : ''
            }
        </div>
    </div>

}

export default DemandEdit
