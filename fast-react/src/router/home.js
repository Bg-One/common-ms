import './home.scss'
import {Outlet, Route, Routes} from 'react-router-dom'
import LayoutHeader from '../content/layout/layout-header'
import LayoutFooter from '../content/layout/layout-footer'
import LayoutMenu from '../content/layout/layout-menu'
import {Layout} from 'antd'


const {Sider, Content} = Layout

const Home = (props) => {
    return <div id="page-home">
        <Layout>
            <Sider>
                <LayoutMenu/>
            </Sider>
            <Content>
                <LayoutHeader/>
                <div className={'page-home-content'}>
                    <Outlet/>
                </div>
            </Content>
        </Layout>
        <LayoutFooter/>
    </div>


}

export default Home
