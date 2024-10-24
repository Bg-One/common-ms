import {Menu} from 'antd'
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {findLabelsByKey, findMenuInfoByKeyAndField} from "../../utils/bread-crum";
import './layout-menu.scss'
import {componentMap, otherMenuConfig} from "../../common/config/menu-config";
import {useEffect, useRef} from "react";
import {addTab} from "../../redux/tab/tab-slice";

const LayoutMenu = ({collapsed}) => {
    const navigator = useNavigate();
    const menuConfig = useSelector(state => state.user.menuConfig)
    const location = useLocation()
    const dispatch = useDispatch();

    useEffect(() => {
        addTabAction(location.pathname)
    }, [])

    const addTabAction = (key) => {
        let component = findMenuInfoByKeyAndField([...menuConfig, ...otherMenuConfig], key, 'component')
        let label = findMenuInfoByKeyAndField([...menuConfig, ...otherMenuConfig], key, 'label')
        if (component) {
            let Component = componentMap[component];
            const tab = {
                label: label,
                children: <React.Suspense fallback={<div>Loading...</div>}>
                    <Component/>
                </React.Suspense>,
                key: key,
            }
            dispatch(addTab(tab))
        }

    }


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
                addTabAction(record.key)
            }}
        />
    </div>
}


export default LayoutMenu
