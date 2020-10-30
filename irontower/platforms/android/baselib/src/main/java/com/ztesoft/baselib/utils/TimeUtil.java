package com.ztesoft.baselib.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by fengxuan on 2017/8/15.
 */

public class TimeUtil {

    /**
     * 将时间戳转成时间串
     * @param timeStamp
     * @return
     */
    public static String parseTimeStamp(String timeStamp){

        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return format.format(Long.valueOf(timeStamp));
    }

    /**
     * 将date对象转化为String
     * @param date
     * @return
     */
    public static String getTime(Date date){

        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        return format.format(date);
    }

    /**
     * 将date对象转化为String
     * @param time
     * @return
     */
    public static Date getDate(String time){

        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        try {
            return format.parse(time);
        } catch (ParseException e) {
            LogUtils.i("时间转换异常,TimeUtil-》getDate（）");
            e.printStackTrace();
        }
        return null;
    }


    public static String getCurrentTime(){
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return format.format(new Date(System.currentTimeMillis()));
    }
}
