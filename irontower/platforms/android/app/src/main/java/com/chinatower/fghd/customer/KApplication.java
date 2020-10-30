package com.chinatower.fghd.customer;

import android.app.Application;
import android.util.Log;

import com.baidu.mapapi.SDKInitializer;
import com.tencent.bugly.crashreport.CrashReport;
import com.tencent.smtt.sdk.QbSdk;
import com.ztesoft.baselib.utils.FileUtils;
import com.ztesoft.baselib.utils.GlideUtils;
import com.ztesoft.baselib.views.ToastView;

import org.apache.cordova.CordovaWebView;

import cn.jpush.android.api.JPushInterface;

/**
 * @auther EnzoChan
 * created:2020-03-31
 * desc:
 */
public class KApplication extends Application {


    protected CordovaWebView appView;


    public CordovaWebView getAppView() {
        return appView;
    }

    public void setAppView(CordovaWebView appView) {
        this.appView = appView;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        ToastView.init(this.getApplicationContext());

///Users/kunfengchen/Documents/as_pro/iwhale/irontower/irontower/platforms/android/app/src/main/java/com/chinatower/fghd/customer/KApplication.java
//        FileUtils.readData("../../../../../../../../../../public/baseurl.js");
        JPushInterface.setDebugMode(true);    // 设置开启日志,发布时请关闭日志
        JPushInterface.init(this);            // 初始化 JPush




        //搜集本地tbs内核信息并上报服务器，服务器返回结果决定使用哪个内核。

        QbSdk.PreInitCallback cb = new QbSdk.PreInitCallback() {

            @Override
            public void onViewInitFinished(boolean arg0) {
                // TODO Auto-generated method stub
                //x5內核初始化完成的回调，为true表示x5内核加载成功，否则表示x5内核加载失败，会自动切换到系统内核。
                Log.d("ckf", " onViewInitFinished is " + arg0);
            }

            @Override
            public void onCoreInitFinished() {
                // TODO Auto-generated method stub
            }
        };
        //x5内核初始化接口
        QbSdk.initX5Environment(getApplicationContext(), cb);


        CrashReport.initCrashReport(getApplicationContext(), "aa82ea15ac", false);

        // glide 初始化
        GlideUtils.init(getApplicationContext());

        //百度sdk初始化
        SDKInitializer.initialize(getApplicationContext());


    }



}
