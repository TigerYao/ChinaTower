package com.ztesoft.baselib.utils;

import android.app.ActivityManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.util.Log;

import java.util.List;

/**
 * Created by fengxuan on 2017/9/6.
 */

public class ServiceUtil {

    /**
     * 判断Service是否在运行
     *
     * @param mContext
     * @param action
     * @return
     */
    public static boolean isServiceRunning(Context mContext, String action) {
        String serviceClassName = isServiceExit(mContext, action);
        if (serviceClassName == null) {
            return false;
        }

        ActivityManager activityManager = (ActivityManager) mContext.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningServiceInfo> services = activityManager.getRunningServices(Integer.MAX_VALUE);

        if (services != null) {
            for (ActivityManager.RunningServiceInfo runningServiceInfo : services) {
                if (runningServiceInfo.service.getClassName().equals(serviceClassName)) {
                    return true;
                }
            }
        }
        return false;
    }

    public static boolean isServiceExisted(Context context, String className) {
        ActivityManager activityManager = (ActivityManager) context
                .getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningServiceInfo> serviceList = activityManager
                .getRunningServices(Integer.MAX_VALUE);

        if (!(serviceList.size() > 0)) {
            return false;
        }

        for (int i = 0; i < serviceList.size(); i++) {
            ActivityManager.RunningServiceInfo serviceInfo = serviceList.get(i);
            ComponentName serviceName = serviceInfo.service;

            if (serviceName.getClassName().equals(className)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 判断Service是否存在
     *
     * @param context
     * @param action
     * @return
     */
    private static String isServiceExit(Context context, String action) {
        Intent implicitIntent = new Intent(action);
        PackageManager pm = context.getPackageManager();
        List<ResolveInfo> resolveInfo = pm.queryIntentServices(implicitIntent, 0);

        if (resolveInfo == null || resolveInfo.size() != 1) {
            if (resolveInfo == null) {
                Log.d("ckf", "resolveInfo == null");
            } else {
                Log.d("ckf", "resolveInfo.size() != 1, it's " + resolveInfo.size());
            }
            return null;
        }

        ResolveInfo serviceInfo = resolveInfo.get(0);
        String packageName = serviceInfo.serviceInfo.packageName;
        String className = serviceInfo.serviceInfo.name;

        return className;
    }

}
