package com.ztesoft.baselib.utils;


import java.text.DateFormat;
import java.text.ParseException;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.TimeZone;

public class DateUtil {
    public static final String TAG = "DateUtil";
    public static final String FORMATE_DATE_STR = "yyyy-MM-dd";
    private static final ThreadLocal<SimpleDateFormat> dateFormater = new ThreadLocal() {
        protected SimpleDateFormat initialValue() {
            return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        }
    };
    private static final ThreadLocal<SimpleDateFormat> dateFormater2 = new ThreadLocal() {
        protected SimpleDateFormat initialValue() {
            return new SimpleDateFormat("yyyy-MM-dd");
        }
    };


    public static String getYYMDHM() {
        Date date = new Date();
        return format(date, "yyyy-MM-dd");
    }


    public static String getMDHM() {
        Date date = new Date();
        return getMDHM(date.getTime());
    }

    public static String getMDHM(long milliseconds) {
        Date date = new Date(milliseconds);
        return String.format("%02d/%02d %02d:%02d", date.getMonth() + 1,
                date.getDate(), date.getHours(), date.getMinutes());
    }

    /**
     * 获取年月
     *
     * @param date
     * @return
     */
    public static String getYM(Date date) {
        return format(date, "yyyy-MM");
    }

    /**
     * 获取月天
     *
     * @param date
     * @return
     */
    public static String getMD(Date date) {
        return format(date, "MM-dd");
    }

    /**
     * 获取小时分钟
     *
     * @param date
     * @return
     */
    public static String getHM(Date date) {
        return format(date, "HH:mm:ss");
    }


    public static String getMS(long time) {
        Date date = new Date(time);
        return format(date, "mm分ss秒");

    }

    public static String getHM(long time) {
        Date date = new Date(time);
        return format(date, "HH小时mm分钟");

    }

    public static String format(Date date, String format) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        return sdf.format(cal.getTime());
    }


    public static String friendlyTime(Date time) {
        if (time == null) {
            return "Unknown";
        } else {
            String ftime = "";
            Calendar cal = Calendar.getInstance();
            String curDate = ((SimpleDateFormat) dateFormater2.get()).format(cal.getTime());
            String paramDate = ((SimpleDateFormat) dateFormater2.get()).format(time);
            if (curDate.equals(paramDate)) {
                int lt1 = (int) ((cal.getTimeInMillis() - time.getTime()) / 3600000L);
                if (lt1 == 0) {
                    ftime = Math.max((cal.getTimeInMillis() - time.getTime()) / 60000L, 1L) + "分钟前";
                } else {
                    ftime = lt1 + "小时前";
                }

                return ftime;
            } else {
                long lt = time.getTime() / 86400000L;
                long ct = cal.getTimeInMillis() / 86400000L;
                int days = (int) (ct - lt);
                if (days == 0) {
                    int hour = (int) ((cal.getTimeInMillis() - time.getTime()) / 3600000L);
                    if (hour == 0) {
                        ftime = Math.max((cal.getTimeInMillis() - time.getTime()) / 60000L, 1L) + "分钟前";
                    } else {
                        ftime = hour + "小时前";
                    }
                } else if (days == 1) {
                    ftime = "昨天";
                } else if (days == 2) {
                    ftime = "前天 ";
                } else if (days > 2 && days < 7) {
                    ftime = days + "天前";
                }
//				} else if(days >= 31 && days <= 62) {
//					ftime = "一个月前";
//				} else if(days > 62 && days <= 93) {
//					ftime = "2个月前";
//				} else if(days > 93 && days <= 124) {
//					ftime = "3个月前";
//				} else {
                else {
                    ftime = ((SimpleDateFormat) dateFormater2.get()).format(time);
                }

                return ftime;
            }
        }
    }

    public static String PlayedTime(Date time) {
        if (time == null) {
            return "Unknown";
        } else {
            String ftime = "刚刚";
            Calendar cal = Calendar.getInstance();
            String curDate = ((SimpleDateFormat) dateFormater2.get()).format(cal.getTime());
            String paramDate = ((SimpleDateFormat) dateFormater2.get()).format(time);

            long lt = time.getTime() / 86400000L;
            long ct = cal.getTimeInMillis() / 86400000L;
            int hour = (int) ((cal.getTimeInMillis() - time.getTime()) / 3600000L);
            if (hour < 1) {
                ftime = "刚刚";
            }
            if (hour >= 1 && hour < 12) {
                ftime = "一小时前";
            }
            if (hour >= 12 && hour < 24) {
                ftime = "半天前";
            }
            if (hour >= 24) {
                ftime = "1天前";
            }
            return ftime;
        }
    }

    public static boolean isCurrentYear(Date date) {
        Date today = Calendar.getInstance().getTime();
        if (today.getYear() == date.getYear()) {
            return true;
        }
        return false;
    }

    /**
     * 是否是本月
     *
     * @param date
     * @return
     */
    public static boolean isCurrentMonth(Date date) {
        Date today = Calendar.getInstance().getTime();
        if (today.getYear() == date.getYear()
                && today.getMonth() == date.getMonth()) {
            return true;
        }
        return false;
    }

    /**
     * 是否是今天
     *
     * @param date
     * @return
     */
    public static boolean isToday(Date date) {
        Date today = Calendar.getInstance().getTime();
        if (today.getYear() == date.getYear()
                && today.getMonth() == date.getMonth()
                && today.getDate() == date.getDate()) {
            return true;
        }
        return false;
    }

    /**
     * 是否是昨天
     *
     * @param date
     * @return
     */
    public static boolean isYesterday(Date date) {
        long time = date.getTime() + 24 * 3600 * 1000;
        return isToday(new Date(time));
    }

    public static String todayFriendlyTime(Date date) {
        StringBuilder time = new StringBuilder();
        if (DateUtil.isToday(date)) {
            SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
            time.append("今天 ");
            time.append(dateFormat.format(date));
        } else {
            SimpleDateFormat format = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
            time.append(format.format(date));
        }
        return time.toString();
    }

    public static String getHHMMDD(Date date) {
        StringBuilder time = new StringBuilder();
        SimpleDateFormat format = new SimpleDateFormat("yyyy/MM/dd");
        time.append(format.format(date));
        return time.toString();
    }

    /**
     * 获取当前日期 格式  yyyy-MM-dd
     *
     * @return
     */
    public static String getNowDate() {
        return new SimpleDateFormat("yyyy-MM-dd").format(new Date());
    }

    public static boolean isSameMonth(Date date, Date date2) {
        if (date.getYear() == date2.getYear() && date.getMonth() == date2.getMonth()) {
            return true;
        }
        return false;
    }

    /**
     * 根据生日获取年龄;
     *
     * @param brithday
     * @return
     * @throws ParseException
     * @author jerry.chen
     */
    public static int getCurrentAgeByBirthdate(String brithday) {
        if (null == brithday || "".equals(brithday)) {
            return 0;
        }
        try {
            Calendar calendar = Calendar.getInstance();
            SimpleDateFormat formatDate = new SimpleDateFormat(FORMATE_DATE_STR);
            String currentTime = formatDate.format(calendar.getTime());
            Date today = formatDate.parse(currentTime);
            Date brithDay = formatDate.parse(brithday);

            return today.getYear() - brithDay.getYear();
        } catch (Exception e) {
            return 0;
        }
    }

    public static String weekFriendly(Date date) {
        if (isToday(date)) {
            return "今天";
        }
        if (isYesterday(date)) {
            return "昨天";
        }
        return time2Week(date);
    }

    /**
     * 获取时间对应周几字符串
     *
     * @param d 时间
     * @return 周几，如周一等
     */
    public static String time2Week(Date d) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(d);
        int iWeek = cal.get(Calendar.DAY_OF_WEEK);
        switch (iWeek) {
            case Calendar.SUNDAY:
                return "周日";
            case Calendar.MONDAY:
                return "周一";
            case Calendar.TUESDAY:
                return "周二";
            case Calendar.WEDNESDAY:
                return "周三";
            case Calendar.THURSDAY:
                return "周四";
            case Calendar.FRIDAY:
                return "周五";
            case Calendar.SATURDAY:
                return "周六";
        }
        return "";
    }


    /**
     * long 转 date
     *
     * @param time
     * @return
     */
    public static Date long2Date(long time) {

        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = null;
        try {
            String str = format.format(new Date(time));
            date = format.parse(str);
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
        return date;

    }

    /****
     * long型时间转换成 2010
     *
     * @param time
     * @return
     */
    public static String getYearMD(long time) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date dt = new Date(time);
        return sdf.format(dt);
    }


    /***
     * 将所给的日期时间，转换成需要的类型。
     *
     * @param strformat 如 “M-d HH:mm” “HH:mm”
     * @param times     utc-long 型，时间单位为秒
     * @return
     */
    public static String getFormateDateStr(String strformat, long times) {
        DateFormat format = new SimpleDateFormat(strformat);
        return format.format(new Date(times));
    }


    /**
     * 将长时间格式字符串转换为时间 yyyy-MM-dd HH:mm:ss
     *
     * @param strDate
     * @return
     */
    public static Date strToDateLong(String strDate) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        ParsePosition pos = new ParsePosition(0);
        Date strtodate = formatter.parse(strDate, pos);
        return strtodate;
    }

    /**
     * 计算当前日期与传入日期之间相差的天数
     *
     * @param date2
     * @return
     */
    public static int daysBetween(Date date2) {
        Date date1 = new Date();
        Calendar cal = Calendar.getInstance();
        cal.setTime(date1);
        long time1 = cal.getTimeInMillis();
        cal.setTime(date2);
        long time2 = cal.getTimeInMillis();
        long between_days = (time2 - time1) / (1000 * 3600 * 24);

        return Integer.parseInt(String.valueOf(between_days));
    }

    /**
     * 判断是否是上午
     *
     * @return
     */
    public static boolean isAM() {
        GregorianCalendar ca = new GregorianCalendar();
//        结果为“0”是上午 结果为“1”是下午
        return ca.get(GregorianCalendar.AM_PM) == 0;
    }


//    public static long


//    private Date getFirstCreateIndexDate() {
//        SimpleDateFormat formater = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        Date firstDate = null;
//        try {
//// 指定任务的执行时间在早上9点钟
//            firstDate = formater.parse(PubFun.getDateTime("yyyy-MM-dd ", null)
//                    .concat("09:00:00");
//            formater.parse()
//
//        } catch (ParseException e) {
//            e.printStackTrace();
//        }
//        return firstDate;
//    }

    /**
     * 计算两个日期之间相差的天数
     *
     * @param date2
     * @return
     */
    public static int daysBetween(Date date1, Date date2) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date1);
        long time1 = cal.getTimeInMillis();
        cal.setTime(date2);
        long time2 = cal.getTimeInMillis();
        long between_days = (time2 - time1) / (1000 * 3600 * 24);

        return Integer.parseInt(String.valueOf(between_days));
    }

    public static final int SECONDS_IN_DAY = 60 * 60 * 24;
    public static final long MILLIS_IN_DAY = 1000L * SECONDS_IN_DAY;

    public static boolean isSameDayOfMillis(final long ms1, final long ms2) {
        final long interval = ms1 - ms2;
        return interval < MILLIS_IN_DAY
                && interval > -1L * MILLIS_IN_DAY
                && toDay(ms1) == toDay(ms2);
    }

    private static long toDay(long millis) {
        return (millis + TimeZone.getDefault().getOffset(millis)) / MILLIS_IN_DAY;
    }


    public static long getMillis() {
        //先把字符串转成Date类型
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        //此处会抛异常
        Date date = null;
        try {
            Calendar now = Calendar.getInstance();
            String dataStr = now.get(Calendar.YEAR) + "-" + (now.get(Calendar.MONTH) + 1) + "-" + now.get(Calendar.DAY_OF_MONTH);
            String timeStr = null;
            if (isAM()) {
                timeStr = " 11:00:00";
            } else {
                timeStr = " 16:00:00";
            }
            date = sdf.parse(dataStr + timeStr);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        //获取毫秒数
        long longDate = date.getTime();
        return longDate;
    }

}
