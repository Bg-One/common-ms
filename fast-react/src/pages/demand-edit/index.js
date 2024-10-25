import React, {useEffect, useRef, useState} from "react";
import './index.scss'
import TreeSearch from "../../content/demand-tree-search/tree-search";
import {getDemandApi, listNodesApi, updateDemandApi} from "../../common/api/producems/demand";
import {deepCopy} from "../../utils/table";
import {createTreeItem, handleTree} from "../../utils/tree-data";
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
import {message, Tabs} from "antd";

const DemandEdit = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [nodeList, setNodeList] = useState([])
    const [treeData, setTreeData] = useState([])
    const [activeNode, setActiveNode] = useState('')
    const [pageX, setPageX] = useState(0);
    const [pageY, setPageY] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const dropdownElement = useRef(null);
    const [demandManage, setDemandManage] = useState({objective: '', reader: ''})
    useEffect(() => {
        listNodes()
        getDemandDetil()
    }, [])

    useEffect(() => {
        focusDropdown();
    }, [showMenu]);

    useEffect(() => {
        if (activeNode === '') {

        } else if (activeNode === '') {

        }
    }, [activeNode])
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
    };
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
                    <RightMenu/>
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
                    setActiveNode(e[0])
                }}
                defaultData={treeData}
                dataList={nodeList}
                handleRightClick={handleRightClick}
            />
            {renderMenu()}
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
                                    <Tabs defaultActiveKey="1" items={[
                                        {
                                            key: '1',
                                            label: '需求功能设计',
                                            children: <DemandItemContent/>,
                                        },
                                        {
                                            key: '2',
                                            label: '开发详细设计',
                                            children: <SoftDetaildesign/>,
                                        }]} onChange={() => {
                                        console.log(1)
                                    }
                                    }/>
            }
        </div>
    </div>

}

export default DemandEdit
