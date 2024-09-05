import {HashRouter, Navigate, Route, Routes, useNavigate} from 'react-router-dom'
import Login from '../pages/login'
import Home from './home'
import AuthRoute from "./router-peotect";
import {useSelector} from "react-redux";
import {componentMap} from "../common/config/menu-config";
import ErrorPage from "../content/error-page";

const MainRouter = (props) => {
    const isAuthenticated = useSelector(state => state.user.isAuthenticated);
    const routers = useSelector(state => state.user.routers);
    return <HashRouter>
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/home" element={<AuthRoute><Home/></AuthRoute>}>
                {
                    routers.map(route => {
                        const Component = componentMap[route.component];
                        if (!Component && !route.component) {
                            // 处理未找到的组件
                            console.error(`Component not found for route: ${route.path}`);
                            return null;
                        }
                        return (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={
                                    <React.Suspense fallback={<div>Loading...</div>}>
                                        <Component/>
                                    </React.Suspense>
                                }
                            />)
                    })
                }
                <Route path="*" element={<ErrorPage/>}/>
            </Route>
            <Route path="*" element={<ErrorPage/>}/>
            {/* 路由重定向 绑定登录状态*/}
            <Route path="/"
                   element={isAuthenticated ? <Navigate replace to="/home/index"/> : <Navigate replace to="/login"/>}/>
        </Routes>
    </HashRouter>
}


export default MainRouter
