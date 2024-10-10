import {createSlice} from '@reduxjs/toolkit';
import {getRoutersApi, getUserInfoApi} from "../../common/api/sys/sys-api";
import Cookies from "js-cookie";
import MyIcon from "../../content/custom-icon";
import {menuTypeEnum} from "../../common/enmus/menu-type-enum";
import {menuConfig} from "../../common/config/menu-config";

export const fetchDataAndDoSomething = () => async (dispatch) => {
    //获取用户信息
    let userRes = await getUserInfoApi();
    await dispatch(setUserInfo(userRes.data))
    //获取菜单信息
    let routersRes = await getRoutersApi();
    let routersConfig = []
    let routerResData = routersRes.data;
    let userGuid = userRes.data.user.userGuid;
    createRouters(userGuid, routerResData, routersConfig)
    await dispatch(setRouters(routersConfig))
    await dispatch(setMenuConfig(createMenuConfig(userGuid, routerResData)))
    // 两个dispatch都执行完毕了，现在可以做一些其他事情
    dispatch(setLoading(false))
};
export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isAuthenticated: !!Cookies.get('access_token'),
        isLoading: true,
        userInfo: {},
        routers: [],
        menuConfig: [],
    },
    reducers: {
        setAuthentication: (state, action) => {
            state.isAuthenticated = action.payload;
        },
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setRouters: (state, action) => {
            state.routers = action.payload;
        },
        setMenuConfig: (state, action) => {
            state.menuConfig = action.payload;
        },
    },
});
//生成路由
const createRouters = (userGuid, routers, routersConfig) => {
    if (userGuid === '1') {
        createRoutersByMenu(menuConfig, routersConfig)
    } else {
        createRoutersByRes(routers, routersConfig)
    }
}
//根据默认菜单生成路由
const createRoutersByMenu = (menuConfig, routersConfig) => {
    for (const menu of menuConfig) {
        routersConfig.push({
            path: '/home' + menu.key,
            component: menu.component,
        })
        const routers = menu.children
        if (routers && routers.length !== 0) {
            createRoutersByMenu(routers, routersConfig)
        }
    }
}
//根据后端返回数据生成路由
const createRoutersByRes = (routers, routersConfig) => {
    for (const router of routers) {
        if (router.menuType === menuTypeEnum.C) {
            routersConfig.push({
                path: '/home' + router.path,
                component: router.component,
            })
        }
        const routers = router.children
        if (routers.length !== 0) {
            createRoutersByRes(routers, routersConfig)
        }
    }
}

//生成菜单
const createMenuConfig = (userGuid, routers) => {
    if (userGuid === '1') {
        return createMenuConfigByMenu(menuConfig)
    } else {
        return createMenuConfigByRes(routers)
    }
}
//根据默认配置生成菜单
const createMenuConfigByMenu = (routers) => {
    let menuConfigDefine = []
    for (const menu of routers) {
        let menuItem = {
            key: '/home' + menu.key,
            icon: menu.icon,
            label: menu.label,
        }
        if (menu.children && menu.children.length !== 0) {
            const routers = menu.children
            menuItem.children = createMenuConfigByMenu(routers)
        }
        menuConfigDefine.push(menuItem)
    }
    return menuConfigDefine
}
//根据后端返回生成菜单
const createMenuConfigByRes = (routers) => {
    let menuConfigDefine = []
    for (const router of routers) {
        let menuItem = {
            key: '/home' + router.path,
            icon: <MyIcon type={router.icon}/>,
            label: router.menuName,
        }

        if (router.children.length !== 0) {
            const routers = router.children
            menuItem.children = createMenuConfigByRes(routers)
        }
        menuConfigDefine.push(menuItem)
    }
    return menuConfigDefine
}

export const {setAuthentication, setRouters, setMenuConfig, setLoading, setUserInfo} = userSlice.actions;
export default userSlice.reducer;
