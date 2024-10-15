import './home.scss'
import {Outlet, Route, Routes} from 'react-router-dom'
import LayoutHeader from '../content/layout/layout-header'
import LayoutFooter from '../content/layout/layout-footer'
import LayoutMenu from '../content/layout/layout-menu'
import {Layout, Tabs} from 'antd'
import {useState} from "react";
import {componentMap} from "../common/config/menu-config";

const {Sider, Content} = Layout

const Home = (props) => {

    const [activeKey, setActiveKey] = useState("1");
    const [tabItems, setTabItems] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const onChange = (key) => {
        setActiveKey(key);
    };
    const addTab = (tab) => {
        if (tabItems.find(item => item.key === tab.key)) return
        setTabItems([
            ...tabItems,
            tab
        ]);
        setActiveKey(tab.key);
    };


    return <div id="page-home">
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <LayoutMenu collapsed={collapsed} addTab={addTab}/>
            </Sider>
            <Content>
                <LayoutHeader toggleCollapsed={toggleCollapsed} collapsed={collapsed}/>
                <div className={'page-home-content'}>
                    <Tabs
                        hideAdd
                        onChange={onChange}
                        activeKey={activeKey}
                        type="editable-card"
                        items={tabItems}
                    />
                    {/*<Outlet/>*/}
                </div>
            </Content>
        </Layout>
        <LayoutFooter/>
    </div>


}

export default Home
