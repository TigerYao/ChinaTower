package com.ztesoft.baselib.utils;


import android.text.TextUtils;
import android.util.Log;

/**
 * 自定义Log,输出之前判断是否debug模式, 是否DEBUG模式，发布时需要设置为false true
 *
 * @author: huhui
 * @time: 2016/5/21 16:25
 */
public class LogUtils {

    // 是否DEBUG模式，发布时需要设置为 false
    public static final boolean DEBUG = true;
    public static String customTagPrefix = "";
    private static boolean hasInit = false;

    private static long curTime;

    private LogUtils() {
    }

    /**
     * TAG:类名 + 方法名 + 行数
     * @param msg
     */
    public static void i(String msg){
        if (DEBUG){
            StackTraceElement caller = getCallerStackTraceElement();
            String tag = generateTag(caller);
            Log.i(tag,msg);
        }
    }

    public static void e(String msg){
        if (DEBUG){
            StackTraceElement caller = getCallerStackTraceElement();
            String tag = generateTag(caller);
            Log.e(tag,msg);
        }
    }

    public static void d(String msg){
        if (DEBUG){
            StackTraceElement caller = getCallerStackTraceElement();
            String tag = generateTag(caller);
            Log.d(tag,msg);
        }
    }

    public static void v(String msg){
        if (DEBUG){
            StackTraceElement caller = getCallerStackTraceElement();
            String tag = generateTag(caller);
            Log.v(tag,msg);
        }
    }

    public static void w(String msg){
        if (DEBUG){
            StackTraceElement caller = getCallerStackTraceElement();
            String tag = generateTag(caller);
            Log.w(tag,msg);
        }
    }

    /**
     * 输出 INFO 日志信息.
     *
     * @param tag
     * @param msg
     */
    public static void i(String tag, String msg) {
        if (DEBUG) {
            Log.i(tag, msg);
        }
    }

    /**
     * 输出 DEBUG 日志信息.
     *
     * @param tag
     * @param msg
     */
    public static void d(String tag, String msg) {
        if (DEBUG) {
            Log.d(tag, msg);
        }
    }

    /**
     * 输出 ERROR 日志信息.
     *
     * @param tag
     * @param msg
     */
    public static void e(String tag, String msg) {
        // 这个日志要输出，要不然有错误，获取不到日志。
        if (DEBUG) {
            Log.e(tag, msg);
        }
    }

    /**
     * 输出 VERBOSE 日志信息.
     *
     * @param tag
     * @param msg
     */
    public static void v(String tag, String msg) {
        if (DEBUG) {
            Log.v(tag, msg);
        }
    }

    /**
     * 输出 WARN 日志信息.
     *
     * @param tag
     * @param msg
     */
    public static void w(String tag, String msg) {
        // 这个日志要输出，要不然有错误，获取不到日志。
        // if (DEBUG) {
        Log.w(tag, msg);
        // }
    }

    /**
     * 输出 时间 日志信息.
     *
     * @param tag
     * @param msg
     */
    public static void time(String tag, String msg) {
        if (DEBUG) {
            long t = System.currentTimeMillis();
            Log.i(tag, msg + " this operate cost " + (t - curTime));
        }
    }

    /**
     * 统计时间归零
     */
    public static void resetTime() {
        if (DEBUG) {
            curTime = System.currentTimeMillis();
        }
    }

    public static StackTraceElement getCallerStackTraceElement() {
        return Thread.currentThread().getStackTrace()[4];
    }

    private static String generateTag(StackTraceElement caller) {
        String tag = "%s.%s(L:%d)";
        String callerClazzName = caller.getClassName();
        callerClazzName = callerClazzName.substring(callerClazzName.lastIndexOf(".") + 1);
        tag = String.format(tag, callerClazzName, caller.getMethodName(), caller.getLineNumber());
        tag = TextUtils.isEmpty(customTagPrefix) ? tag : customTagPrefix + ":" + tag;

        return tag;
    }
}
