// src/hooks/time.js
export const timeDistance = (timeStr) => {
    // 将输入的时间字符串转换为 Date 对象
    const time = new Date(timeStr);
    const now = new Date();

    // 计算时间差（单位：毫秒）
    const diff = now - time;

    // 定义时间单位
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerWeek = msPerDay * 7;
    const msPerMonth = msPerDay * 30; // 这里假设一个月为30天
    const msPerYear = msPerDay * 365; // 这里假设一年为365天

    // 计算时间差
    if (diff < msPerHour) {
        return "刚刚";
    } else if (diff < msPerDay) {
        return Math.floor(diff / msPerHour) + "小时前";
    } else if (diff < msPerWeek) {
        return Math.floor(diff / msPerDay) + "天前";
    } else if (diff < msPerMonth) {
        return Math.floor(diff / msPerWeek) + "周前";
    } else if (diff < msPerYear) {
        return Math.floor(diff / msPerMonth) + "月前";
    } else {
        return Math.floor(diff / msPerYear) + "年前";
    }
};