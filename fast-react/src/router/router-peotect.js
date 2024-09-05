import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Navigate} from 'react-router-dom';
import {fetchDataAndDoSomething} from '../redux/user/user-slice';

function AuthRoute({children}) {
    const isAuthenticated = useSelector(state => state.user.isAuthenticated);
    const isLoading = useSelector(state => state.user.isLoading);
    const dispatch = useDispatch();

    useEffect(() => {
        // 如果用户已认证，则加载初始化数据
        if (isAuthenticated) {
            dispatch(fetchDataAndDoSomething())
        }
    }, [isAuthenticated, dispatch]); // 依赖项包括isAuthenticated和dispatch
    if (!isAuthenticated) {
        // 如果未认证，重定向到登录页面
        return <Navigate to="/login" replace/>;
    } else if (isLoading) {
        // 加载中状态，可以显示加载指示器
        return <div>Loading...</div>;
    }


    // 如果用户有特定角色（如果需要的话），可以在这里添加角色检查
    // 例如：if (!userRole || !roles.includes(userRole)) { ... }

    // 认证通过，渲染子路由
    return children;
}

export default AuthRoute
