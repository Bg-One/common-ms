import {Breadcrumb} from 'antd';
import {useLocation} from 'react-router-dom';
// import {menuConfig} from '../../common/menu-config';
import {findLabelsByKey} from '../../utils/bread-crum';
import {useSelector} from "react-redux";

const LayoutBreadcrumb = () => {
    const location = useLocation()
    const menuConfig = useSelector(state => state.user.menuConfig)
    return <Breadcrumb
        style={{display: 'inline-block', marginLeft: '1vw'}}
        items={findLabelsByKey(menuConfig, location.pathname).map(item => ({
            title: item.label,
        }))}
    />
}

export default LayoutBreadcrumb
