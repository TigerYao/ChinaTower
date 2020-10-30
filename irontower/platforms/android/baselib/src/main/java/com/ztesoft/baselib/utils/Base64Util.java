package com.ztesoft.baselib.utils;

import android.util.Base64;

/**
 * Created by fengxuan on 2017/8/11.
 */

public class Base64Util {

    public static String getImageString(byte[] data){

        return Base64.encodeToString(data,Base64.DEFAULT);
    }
}
