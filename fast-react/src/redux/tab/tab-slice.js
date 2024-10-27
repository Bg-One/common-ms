import {createSlice} from "@reduxjs/toolkit";


export const tabSlice = createSlice({
    name: 'tab',
    initialState: {
        tabList: [],
        activeKey: ['1'],
        reloadTabObj: {}
    },
    reducers: {
        setTabList: (state, action) => {
            state.tabList = action.payload;
        },
        addTab: (state, action) => {
            state.activeKey = action.payload.key
            if (state.tabList.find(item => item.key === action.payload.key)) return
            state.tabList = [
                ...state.tabList,
                action.payload,

            ];
        },
        removeTab: (state, action) => {
            state.tabList = state.tabList.filter(item => item.key !== action.payload)
        },
        removeAllTab: (state, action) => {
            state.tabList = state.tabList.filter(item => item.key === '/home/produce');
            action.payload('/home/produce')
        },
        removeOtherTab: (state, action) => {
            state.tabList = state.tabList.filter(item => item.key === action.payload)
        },
        setTabLabel: (state, action) => {

        },
        setActiveKey: (state, action) => {
            state.activeKey = action.payload;
        }
    },
});
export const {addTab, removeTab, removeAllTab, removeOtherTab, setActiveKey, setTabList} = tabSlice.actions;
export default tabSlice.reducer;
