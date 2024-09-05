import {Menu} from 'antd'
import {useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {findLabelsByKey} from "../../utils/bread-crum";

const LayoutMenu = (props) => {
    const navigator = useNavigate();
    const menuConfig = useSelector(state => state.user.menuConfig)
    const location = useLocation()
    return <div id="layout-menu">
        <Menu
            defaultSelectedKeys={[location.pathname]}
            defaultOpenKeys={findLabelsByKey(menuConfig, location.pathname).map(item => item.key)}
            mode="inline"
            theme="dark"
            items={menuConfig}
            onClick={(record) => {
                navigator(record.key)
            }}
        />
    </div>
}


export default LayoutMenu
