import ReactDOM from 'react-dom/client'
import {ConfigProvider} from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import 'dayjs/locale/zh-cn';

//引入路由
import Router from './src/router/router'

// 赋予给容器组件的store
import store from './src/redux/store'
import {Provider, useSelector} from 'react-redux'

/** 函数式组件 */
const App = () => {
    return <Provider store={store}>
        <ConfigProvider locale={zhCN}>
            <Router/>
        </ConfigProvider>
    </Provider>
}

const root = ReactDOM.createRoot(document.getElementById('app'))
root.render(<App/>)
