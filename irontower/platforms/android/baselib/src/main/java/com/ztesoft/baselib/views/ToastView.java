package com.ztesoft.baselib.views;

import android.content.Context;
import android.widget.Toast;


/**
 * @author ys
 * @ClassName: ToastView
 * @Description: Toast统一管理类
 * @date 2015年5月26日 下午2:15:33
 */
public class ToastView {

    private static Context content = null;
    private static Toast toast = null;

    public static void init(Context ctx) {
        content = ctx;
    }

    /**
     * @param message 提示信息.
     * @Title: showShort
     * @Description: 短时间显示Toast
     * @author ys
     * @date 2015年5月26日 下午2:15:55
     */
    public static void showShort(CharSequence message) {

        show(message, Toast.LENGTH_SHORT);
    }

    /**
     * @param messageResId 资源id .
     * @Title: showShort 短时间显示Toast
     * @Description: TODO(这里用一句话描述这个方法的作用)
     * @author ys
     * @date 2015年5月26日 下午2:16:13
     */
    public static void showShort(int messageResId) {
        show(messageResId, Toast.LENGTH_SHORT);
    }

    /**
     * @param message 提示信息 .
     * @Title: showLong
     * @Description: 长时间显示Toast
     * @author ys
     * @date 2015年5月26日 下午2:16:32
     */
    public static void showLong(CharSequence message) {
        show(message, Toast.LENGTH_LONG);
    }

    /**
     * @param messageResId 资源id.
     * @Title: showLong
     * @Description: 长时间显示Toast
     * @author ys
     * @date 2015年5月26日 下午2:16:51
     */
    public static void showLong(int messageResId) {
        show(messageResId, Toast.LENGTH_LONG);
    }

    /**
     * @param message  提示信息
     * @param duration 显示时长（毫秒）.
     * @Title: show
     * @Description: 自定义显示Toast时间
     * @author ys
     * @date 2015年5月26日 下午2:17:07
     */
    public static void show(CharSequence message, int duration) {
        if (toast == null) {
            toast = Toast.makeText(content, message, duration);
        } else {
            toast.setText(message);
            toast.setDuration(duration);
        }
        toast.show();
    }

    /**
     * @param messageResId 资源Id
     * @param duration     显示时长（毫秒）.
     * @Title: show
     * @Description: 自定义显示Toast时间
     * @author ys
     * @date 2015年5月26日 下午2:17:07
     */
    public static void show(int messageResId, int duration) {
        if (toast == null) {
            toast = Toast.makeText(content, messageResId, duration);
        } else {
            toast.setText(messageResId);
            toast.setDuration(duration);
        }
        toast.show();
    }
}
