package com.ztesoft.baselib.utils.sort;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * Created by fengxuan on 2017/9/24.
 */

public class SharedUtils {

    private static Context context;
    private static SharedUtils instance;
    private SharedPreferences sharedPreferences;
    private static final String SP_NAME = "my_sp";

    private SharedUtils(Context context){
        this.context = context.getApplicationContext();
        sharedPreferences = context.getSharedPreferences(SP_NAME,Context.MODE_PRIVATE);
    }

    public static SharedUtils getInstance(Context context) {

        if (instance == null){
            instance = new SharedUtils(context);
        }
        return instance;
    }

    public void pubValue(String key, String value){
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(key,value);
        editor.commit();
    }

    public String getValue(String key, String defaultS){
        return sharedPreferences.getString(key,defaultS);
    }
}
