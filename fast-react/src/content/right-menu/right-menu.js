import {Button} from "antd";
import './index.scss'

const RightMenu = () => {

    return <div className={'right-menu'}>
        <span className={'menu-item'}>添加分类</span>
        <span className={'menu-item'}>添加需求</span>
        <div>
            <span className={'menu-item'}>修改</span>
            <span className={'menu-item'}>删除</span>
        </div>
        <Button type={'primary'}>取消</Button>
    </div>
}
export default RightMenu
