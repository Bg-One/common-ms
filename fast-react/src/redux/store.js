import {configureStore} from "@reduxjs/toolkit";
import userSlice from "./user/user-slice.js";

// configureStore创建一个redux数据
const store = configureStore({
    // 合并多个Slice
    reducer: {
        user: userSlice,
    }, middleware: getDefaultMiddleware => getDefaultMiddleware({
        //关闭redux序列化检测
        serializableCheck: false
    })

});

export default store;


