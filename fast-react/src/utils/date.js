import dayjs from "dayjs";

export const getWeekFirstDate = (currentDateStr, fmt) => {
    return dayjs(currentDateStr).startOf('week').add(1, 'day').format(fmt)
}

export const getWeekEndDate = (currentDateStr, fmt) => {
    return dayjs(currentDateStr).endOf('week').add(1, 'day').format(fmt)
}
