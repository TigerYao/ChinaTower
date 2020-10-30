package com.ztesoft.baselib.utils;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.text.TextUtils;

import java.util.Set;

/**
 * SharedPreferences封装类
 *
 * @author: EnzoChan
 * @time: 2016/5/21 16:23
 */
public class ShareManager {

    private static final String spName = "clodgather";

    /**
     * 获取应用程序的SharedPreferences句柄，只是在本类使用。
     *
     * @param context 不能为null,如果为null，那么返回null。
     * @return
     */
    private static SharedPreferences getAppSharedPreferences(Context context,
                                                             String userId) {
        if (context == null) {
            return null;
        }
        if (TextUtils.isEmpty(userId)) {
            return context.getSharedPreferences(spName, Context.MODE_PRIVATE);
        } else {
            return context.getSharedPreferences(spName + userId,
                    Context.MODE_PRIVATE);
        }

    }

    /**
     * 功能说明:用来获取当前是否是第一次运行本应用程序。
     *
     * @param context
     * @return 2013-7-30
     * @see #setGuideActivityHadRun(Context)
     * @since v1.0
     */
    public static boolean isFirstOpenApp(Context context) {
        if (context == null) {
            return false;
        }
        SharedPreferences share = getAppSharedPreferences(context,
                ShareManager.getCurrentUserId(context));
        return share.getBoolean(IS_FRIST_OPEN_APP, true);
    }

    /**
     * 功能说明:用来设置应用程序已经打开过。
     *
     * @param context
     * @return 2013-7-30
     * @see #isFirstOpenApp(Context)
     * @since v1.0
     */
    public static boolean setGuideActivityHadRun(Context context) {
        if (context == null) {
            return false;
        }
        try {
            SharedPreferences share = getAppSharedPreferences(context,
                    ShareManager.getCurrentUserId(context));
            Editor edi = share.edit();
            edi.putBoolean(IS_FRIST_OPEN_APP, false);
            edi.commit();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;

    }

    /**
     * 功能说明:设置值。
     *
     * @param context
     * @param key
     * @param value
     * @return
     * @throws null
     * @date 2013-8-19
     * @since v1.0
     */
    public static boolean setValue(Context context, String key, String value) {
        if (context == null) {
            return false;
        }
        try {
            SharedPreferences share = getAppSharedPreferences(context,
                    ShareManager.getCurrentUserId(context));
            Editor edi = share.edit();
            edi.putString(key, value);
            edi.commit();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;

    }

    /**
     * 功能说明:保存设置开关值。
     *
     * @param context
     * @param key
     * @param value
     * @return
     * @throws null
     * @date 2013-8-19
     * @since v1.0
     */
    public static boolean setBooleanValue(Context context, String key,
                                          boolean value) {
        if (context == null) {
            return false;
        }
        try {
            SharedPreferences share = getAppSharedPreferences(context,
                    ShareManager.getCurrentUserId(context));
            Editor edi = share.edit();
            edi.putBoolean(key, value);
            edi.commit();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;

    }

    /**
     * 功能说明:获取值。
     *
     * @param context
     * @param key
     * @return
     * @throws null
     * @date 2013-8-19
     * @since v1.0
     */
    public static boolean getBooleanValue(Context context, String key,
                                          boolean defaultValue) {
        if (context == null) {
            return defaultValue;
        }
        try {
            SharedPreferences share = getAppSharedPreferences(context,
                    ShareManager.getCurrentUserId(context));
            return share.getBoolean(key, defaultValue);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return defaultValue;

    }

    /**
     * 功能说明:获取值。
     *
     * @param context
     * @param key
     * @return
     * @throws null
     * @date 2013-8-19
     * @since v1.0
     */
    public static String getValue(Context context, String key) {
        if (context == null) {
            return "";
        }
        try {
            SharedPreferences share = getAppSharedPreferences(context,
                    ShareManager.getCurrentUserId(context));
            return share.getString(key, "");

        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";

    }

    /**
     * 功能说明:获取值。
     *
     * @param context
     * @param key
     * @param defValue 默认值
     * @return
     * @throws null
     */
    public static String getValueWithDefValue(Context context, String key,
                                              String defValue) {
        if (defValue == null) {
            defValue = "";
        }
        if (context == null) {
            return defValue;
        }
        try {
            SharedPreferences share = getAppSharedPreferences(context,
                    ShareManager.getCurrentUserId(context));
            return share.getString(key, defValue);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return defValue;

    }

    /**
     * 功能说明:设置值。
     *
     * @param context
     * @param key
     * @param value
     * @return
     * @throws null
     * @date 2013-8-19
     * @since v1.0
     */
    public static boolean setInt(Context context, String key, int value) {
        if (context == null) {
            return false;
        }
        try {
            SharedPreferences share = getAppSharedPreferences(context,
                    ShareManager.getCurrentUserId(context));
            Editor edi = share.edit();
            edi.putInt(key, value);
            edi.commit();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;

    }

    /**
     * 功能说明:获取值。
     *
     * @param context
     * @param key     默认值
     * @return
     * @throws null
     */
    public static int getInt(Context context, String key) {

        if (context == null) {
            return 0;
        }
        try {
            SharedPreferences share = getAppSharedPreferences(context,
                    ShareManager.getCurrentUserId(context));
            return share.getInt(key, -1);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;

    }

    /**
     * 设置长整型
     *
     * @param context
     * @param key
     * @param value
     * @return
     */
    public static boolean setLong(Context context, String key, Long value) {
        if (context == null) {
            return false;
        }
        try {
            SharedPreferences share = getAppSharedPreferences(context,
                    ShareManager.getCurrentUserId(context));
            Editor edi = share.edit();
            edi.putLong(key, value);
            edi.commit();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;

    }

    public static Long getLong(Context context, String key) {

        if (context == null) {
            return 0L;
        }
        SharedPreferences share = null;
        try {
            share = getAppSharedPreferences(context,
                    ShareManager.getCurrentUserId(context));
            return share.getLong(key, -1);

        } catch (Exception e) {
            e.printStackTrace();
            String time = share.getString(key, "-1");
            return Long.parseLong(time);
        }

    }

    /***
     * @param context
     * @param key
     * @param value
     * @return
     */
    public static boolean setSetValues(Context context, String key,
                                       Set<String> value) {
        if (context == null) {
            return false;
        }
        try {
            SharedPreferences share = getAppSharedPreferences(context,
                    ShareManager.getCurrentUserId(context));
            Editor edi = share.edit();
            edi.putStringSet(key, value);
            edi.commit();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;

    }

    /**
     * 功能说明:获取值。
     *
     * @param context
     * @param key
     * @return
     * @throws null
     * @date 2013-8-19
     * @since v1.0
     */
    public static Set<String> getSetValue(Context context, String key) {
        if (context == null) {
            return null;
        }
        try {
            SharedPreferences share = getAppSharedPreferences(context,
                    ShareManager.getCurrentUserId(context));
            return share.getStringSet(key, null);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;

    }

    /****
     * 得到当前用户UserId
     *
     * @param context
     * @return
     */
    public static String getCurrentUserId(Context context) {
        if (context == null) {
            return "";
        }
        try {
            SharedPreferences share = getAppSharedPreferences(context, "");
            return share.getString(KEY_USERID, "");

        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";

    }

    /****
     * 每次登陆成功。必须调用。把当前UserId
     *
     * @param context
     * @param userId
     */
    public static void setCurrentUserId(Context context, String userId) {
        if (context != null && TextUtils.isEmpty(userId)) {
        }
        try {
            SharedPreferences share = getAppSharedPreferences(context, "");
            Editor edi = share.edit();
            edi.putString(KEY_USERID, userId);
            edi.commit();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static final String KEY_USERID = "key_userid";

    public static final String IS_FRIST_OPEN_APP = "is_first_open_app";

    /**
     * 用户登陆手机号key
     **/
    public static final String KEY_USERPHONE = "key_user_phone";

    /**
     * 用户登陆密码key
     **/
    public static final String KEY_USER_PW = "key_user_pw";




}
