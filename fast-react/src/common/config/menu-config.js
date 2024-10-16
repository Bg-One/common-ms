/**
 * 配置项
 * 包含枚举及其他常量定义等
 */
import MyIcon from "../../content/custom-icon";
import OnsiteAccept from "../../pages/onsite-acceptance";
import AppearanceAccept from "../../pages/appearance-accept";

export const componentMap = {
    PageMain: React.lazy(() => import('../../pages/main')),
    Dep: React.lazy(() => import('../../pages/dep')),
    User: React.lazy(() => import('../../pages/user')),
    Post: React.lazy(() => import('../../pages/post')),
    Role: React.lazy(() => import('../../pages/role')),
    Authority: React.lazy(() => import('../../pages/authority')),
    LoginLog: React.lazy(() => import('../../pages/loginlog')),
    OperateLog: React.lazy(() => import('../../pages/operalog')),
    Flowable: React.lazy(() => import('../../pages/flowable')),
    FormDesign: React.lazy(() => import('../../pages/form')),
    Produce: React.lazy(() => import('../../pages/produce')),
    Project: React.lazy(() => import('../../pages/project')),
    OnsiteAccept: React.lazy(() => import('../../pages/onsite-acceptance')),
    AppearanceAccept: React.lazy(() => import('../../pages/appearance-accept')),
    // 更多组件...
};
// 默认菜单/面包屑配置
export const menuConfig = [{
    key: '/index',
    icon: <MyIcon type={'icon-main'}/>,
    component: 'PageMain',
    label: '首页',
}, {
    key: '/produce',
    icon: <MyIcon type={'icon-main'}/>,
    component: 'Produce',
    label: '产品列表',
}, {
    key: '/project',
    icon: <MyIcon type={'icon-main'}/>,
    component: 'Project',
    label: '项目列表',
}, {
    key: '/appearance-accept',
    icon: <MyIcon type={'icon-main'}/>,
    component: 'AppearanceAccept',
    label: '出厂验收',
}, {
    key: '/onsitea-accept',
    icon: <MyIcon type={'icon-main'}/>,
    component: 'OnsiteAccept',
    label: '现场验收',
}, {
    key: '/sys',
    label: '系统管理',
    icon: <MyIcon type={'icon-setting'}/>,
    children: [{
        key: '/sys/dep',
        label: '单位管理',
        component: 'Dep',
        icon: <MyIcon type={'icon-danwei'}/>,
    }, {
        key: '/sys/user',
        label: '人员管理',
        component: 'User',
        icon: <MyIcon type={'icon-renyuan'}/>,
    }, {
        key: '/sys/post',
        label: '岗位管理',
        component: 'Post',
        icon: <MyIcon type={'icon-gangwei'}/>,
    }, {
        key: '/sys/role',
        label: '角色管理',
        component: 'Role',
        icon: <MyIcon type={'icon-jiaose'}/>,
    }, {
        key: '/sys/authority',
        label: '菜单/权限管理',
        component: 'Authority',
        icon: <MyIcon type={'icon-zhanghaoquanxianguanli'}/>,
    }, {
        key: '/sys/operatelog',
        label: '操作日志',
        component: 'OperateLog',
        icon: <MyIcon type={'icon-guanlicaozuorizhi'}/>,
    }, {
        key: '/sys/loginlog',
        label: '登录日志',
        component: 'LoginLog',
        icon: <MyIcon type={'icon-xitonggongju-denglurizhi'}/>,
    }]
}, {
    key: '/flowable',
    label: '流程管理',
    icon: <MyIcon type={'icon-flowable'}/>,
    children: [{
        key: '/flowable/design',
        label: '流程设计',
        component: 'Flowable',
        icon: <MyIcon type={'icon-danwei'}/>,
    }, {
        key: '/flowable/form-design',
        label: '表单设计',
        component: 'FormDesign',
        icon: <MyIcon type={'icon-danwei'}/>,
    }]
}]
