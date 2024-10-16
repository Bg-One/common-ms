import {Menu} from 'antd'
import {useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {findLabelsByKey, findMenuInfoByKeyAndField} from "../../utils/bread-crum";
import './layout-menu.scss'
import {componentMap} from "../../common/config/menu-config";
import {useEffect} from "react";

const LayoutMenu = ({collapsed, addTab}) => {
    const navigator = useNavigate();
    const menuConfig = useSelector(state => state.user.menuConfig)
    const location = useLocation()
    useEffect(() => {
        let component = findMenuInfoByKeyAndField(menuConfig, location.pathname, 'component')
        let label = findMenuInfoByKeyAndField(menuConfig, location.pathname, 'label')
        const Component = componentMap[component];
        addTab({
            label: label,
            children: <React.Suspense fallback={<div>Loading...</div>}>
                <Component/>
            </React.Suspense>
            ,
            key: location.pathname,
        })
    })
    return <div id="layout-menu">
        <Menu
            className={collapsed ? "layout-menu-content" : ""}
            defaultSelectedKeys={[location.pathname]}
            defaultOpenKeys={findLabelsByKey(menuConfig, location.pathname).map(item => item.key)}
            mode="inline"
            theme="dark"
            inlineCollapsed={collapsed}
            items={menuConfig}
            onClick={(record) => {
                navigator(record.key)
                let component = findMenuInfoByKeyAndField(menuConfig, record.key, 'component')
                let label = findMenuInfoByKeyAndField(menuConfig, record.key, 'label')
                const Component = componentMap[component];
                addTab({
                    label: label,
                    children: <React.Suspense fallback={<div>Loading...</div>}>
                        <Component/>
                    </React.Suspense>,
                    key: record.key,
                })
            }}
        />
    </div>
}


export default LayoutMenu
