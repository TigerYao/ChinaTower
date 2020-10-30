package com.ztesoft.baselib.netutils;

import android.content.Context;
import android.util.Log;

import com.ztesoft.baselib.utils.ShareManager;

import java.io.IOException;
import java.util.Set;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

/**
 * @auther EnzoChan
 * created:2020-03-02
 * desc:
 */

public class AddCookiesInterceptor implements Interceptor {
    private Context mContext;

    public AddCookiesInterceptor(Context context) {
        this.mContext = context;
    }

    @Override
    public Response intercept(Chain chain) throws IOException {
        Request.Builder builder = chain.request().newBuilder();
        Set<String> preferences = ShareManager.getSetValue(mContext, "config");
        if (preferences != null) {
            for (String cookie : preferences) {
                builder.addHeader("Cookie", cookie);
                Log.v("OkHttp", "Adding Header: " + cookie);
                // This is done so I know which headers are being added; this interceptor is used after the normal logging of OkHttp
            }
        }
        return chain.proceed(builder.build());
    }
}