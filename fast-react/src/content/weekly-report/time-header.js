import './index.scss'
import {Button, DatePicker} from "antd";
import dayjs from "dayjs";
import {getWeekEndDate, getWeekFirstDate} from "../../utils/date";

const TimeHeader = ({currentDateStr, setCurrentDateStr, saveWeeklySetContent}) => {

    return <div id="week-head">
        <span className="page-title">周报</span>
        <div className="time-select">
            <div className="week-jump" onClick={() => {
                let s = dayjs(currentDateStr).add(-7, 'day').format('YYYY-MM-DD');
                setCurrentDateStr(s)
            }}>{'<'}</div>
            <div className="select-week">
                <div>{dayjs(currentDateStr).year()}年第{dayjs(currentDateStr).week()}周</div>
                <div style={{display: 'flex'}}>
                    <div
                        className="range">{getWeekFirstDate(currentDateStr, "MM月DD日")}-{getWeekEndDate(currentDateStr, "MM月DD日")}</div>
                    <DatePicker
                        value={currentDateStr ? dayjs(currentDateStr) : dayjs()}
                        allowClear={false}
                        placeholder={''}
                        style={{width: '1vw'}}
                        className={'timerange'}
                        picker={'week'}
                        showWeek={true}
                        format={'YYYY-MM-DD'}
                        onChange={(value, dateString) => {
                            setCurrentDateStr(dateString)
                        }}
                    />
                </div>
            </div>
            <div className="week-jump" onClick={() => {
                let s = dayjs(currentDateStr).add(7, 'day').format('YYYY-MM-DD');
                setCurrentDateStr(s)
            }}>{'>'}</div>
        </div>
        <Button type={'primary'} onClick={saveWeeklySetContent}>保存</Button>
    </div>
}

export default TimeHeader
