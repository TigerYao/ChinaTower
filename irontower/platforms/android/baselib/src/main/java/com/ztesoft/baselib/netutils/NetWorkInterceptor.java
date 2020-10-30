package com.ztesoft.baselib.netutils;

import android.content.Context;

import com.ztesoft.baselib.views.ToastView;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.Response;

/**
 * @auther EnzoChan
 * created:2020/9/11
 * desc:
 */
public class NetWorkInterceptor implements Interceptor {
    private Context mContext;

    public NetWorkInterceptor(Context context) {
        this.mContext = context;
    }

    @Override
    public Response intercept(Chain chain) throws IOException {
        if (NetUtil.checkNetwork(mContext)==NetUtil.NO_NETWORK){
            ToastView.showLong("当前网络异常，请检查网络设置");
        }
        return chain.proceed(chain.request());
    }
}
