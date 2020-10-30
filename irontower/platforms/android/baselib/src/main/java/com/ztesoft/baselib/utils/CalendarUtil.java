package com.ztesoft.baselib.utils;

import android.content.Context;
import android.text.TextUtils;
import android.widget.ViewFlipper;

import java.util.Date;


public class CalendarUtil {

    /***
     * 得到和传入日期相差的天数
     *
     * @param data
     * @return
     */
    public static long getCountDays(String data) {
        if (TextUtils.isEmpty(data)) {
            return 0;
        }
        Date date = new Date();
        try {
            Date m_endTime = new java.text.SimpleDateFormat("yyyy-MM-dd")
                    .parse(data);
            long days = (m_endTime.getTime() - date.getTime()) / 86400000;
            return days;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return 0;
    }

    public static long getDaysTimes(String data) {
        if (TextUtils.isEmpty(data)) {
            return 0;
        }
        try {
            Date m_endTime = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm")
                    .parse(data);
            long days = m_endTime.getTime();
            return days;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return 0;
    }

    /***
     * 根据groidview 点得到星期
     *
     * @param position
     * @return
     */
    public static String getWeeks(int position) {
        String week = null;
        switch (position % 7) {
            case 0:
                week = "星期日";
                break;
            case 1:
                week = "星期一";
                break;
            case 2:
                week = "星期二";
                break;
            case 3:
                week = "星期三";
                break;
            case 4:
                week = "星期四";
                break;
            case 5:
                week = "星期五";
                break;
            case 6:
                week = "星期六";
                break;
        }
        return week;

    }

    /***
     * 日历动画显示加载
     *
     * @param flipper
     * @param context
     */
    public static void showAnimation(ViewFlipper flipper, Context context) {
//		flipper.setInAnimation(AnimationUtils.loadAnimation(context,
//				R.anim.push_left_in));
//		flipper.setOutAnimation(AnimationUtils.loadAnimation(context,
//				R.anim.push_left_out));
    }

}
