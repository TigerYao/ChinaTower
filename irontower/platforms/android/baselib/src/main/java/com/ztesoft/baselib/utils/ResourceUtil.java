package com.ztesoft.baselib.utils;

import android.content.Context;
import android.util.TypedValue;

/**
 * Created by fengxuan on 2017/7/26.
 */

public class ResourceUtil {

    private static TypedValue typedValue = new TypedValue();

    /**
     * 获取dp值对应的像素值
     * @param context
     * @param id
     * @return
     */
    public static int getXmlDef(Context context, int id){

        synchronized (typedValue) {
            TypedValue value = typedValue;
            context.getResources().getValue(id, value, true);
            return (int)TypedValue.complexToFloat(value.data);
        }
    }
}
