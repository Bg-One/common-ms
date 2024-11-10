import TimeHeader from "../../content/weekly-report/time-header";
import WeeklyReportContent from "../../content/weekly-report/weekly-report-content";
import {useState} from "react";
import dayjs from "dayjs";

const PersonWeeklyReport = () => {
    const [currentDateStr, setCurrentDateStr] = useState(dayjs().format('YYYY-MM-DD'))

    return <div>
        <TimeHeader currentDateStr={currentDateStr} setCurrentDateStr={setCurrentDateStr}/>
        <WeeklyReportContent type={'work'}/>
        <WeeklyReportContent type={'plan'}/>
    </div>
}

export default PersonWeeklyReport
