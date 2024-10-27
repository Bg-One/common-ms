import './home.scss'
import {Outlet, Route, Routes, useLocation, useNavigate} from 'react-router-dom'
import LayoutHeader from '../content/layout/layout-header'
import LayoutFooter from '../content/layout/layout-footer'
import LayoutMenu from '../content/layout/layout-menu'
import {Button, Dropdown, Layout, Menu, Tabs} from 'antd'
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addTab, removeAllTab, removeOtherTab, removeTab, setActiveKey, setTabList} from "../redux/tab/tab-slice";
import {SettingOutlined} from "@ant-design/icons";

const {Sider, Content} = Layout

const Home = (props) => {
    const dispatch = useDispatch();
    const tabList = useSelector(state => state.tab.tabList);
    const activeKey = useSelector(state => state.tab.activeKey);
    const navigator = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };
    const onChange = (key) => {
        navigator(key)
        dispatch(setActiveKey(key));
    };

    //编辑tab
    const onEdit = (targetKey, action) => {
        remove(targetKey);
    };

    //移除tab
    const remove = (targetKey) => {
        let newActiveKey = getNewActiveKey(targetKey);
        const newPanes = getNewTabList(targetKey);
        navigator(newActiveKey)
        dispatch(setActiveKey(newActiveKey))
        dispatch(setTabList(newPanes))
    };

    //获取新的tablIst
    const getNewTabList = (targetKey) => {
        return tabList.filter((item) => item.key !== targetKey);
    }
    //获取新的activeKey
    const getNewActiveKey = (operateKey) => {
        let newActiveKey = operateKey;
        let lastIndex = -1;
        tabList.forEach((item, i) => {
            if (item.key === operateKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = getNewTabList(operateKey);
        if (newPanes.length && newActiveKey === operateKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
        }
        return newActiveKey;
    }
    const dropDownItems = [
        {
            key: '1',
            label: (
                <div onClick={() => {
                    let newActiveKey = getNewActiveKey(activeKey);
                    navigator(newActiveKey)
                    dispatch(setActiveKey(newActiveKey))
                    dispatch(removeTab(activeKey))
                }}>关闭当前标签页</div>
            ),
        },
        {
            key: '2',
            label: (
                <div onClick={() => {
                    dispatch(removeOtherTab(activeKey))
                }}>关闭其他标签页</div>
            ),
        },
        {
            key: '3',
            label: <div onClick={() => {
                dispatch(removeAllTab(navigator))
            }}>关闭全部标签页</div>,
        },
    ];
    return <div id="page-home">
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <LayoutMenu collapsed={collapsed}/>
            </Sider>
            <Content>
                <LayoutHeader toggleCollapsed={toggleCollapsed} collapsed={collapsed}/>
                <div className={'page-home-content'}>
                    <Tabs
                        tabBarExtraContent={{
                            left: <Dropdown
                                menu={{items: dropDownItems}}
                            >
                                <SettingOutlined/>
                            </Dropdown>
                        }}
                        hideAdd
                        onEdit={onEdit}
                        onChange={onChange}
                        activeKey={activeKey}
                        type="editable-card"
                        items={tabList}
                    />
                    {/*<Outlet/>*/}
                </div>
            </Content>
        </Layout>
        <LayoutFooter/>
    </div>


}

export default Home
