package com.ztesoft.baselib.netutils;

/**
 * @auther EnzoChan
 * created:2020-03-02
 * desc:
 */

import android.content.Context;
import android.content.SharedPreferences;

import com.ztesoft.baselib.utils.ShareManager;

import java.io.IOException;
import java.util.HashSet;

import okhttp3.Interceptor;
import okhttp3.Response;

/**
 * @author : jc.lu
 * @create : 17/07/07.
 */
public class ReceivedCookiesInterceptor implements Interceptor {

    private Context mContext;

    public ReceivedCookiesInterceptor(Context context) {
        this.mContext = context;
    }

    @Override
    public Response intercept(Chain chain) throws IOException {
        Response originalResponse = chain.proceed(chain.request());

        if (!originalResponse.headers("Set-Cookie").isEmpty()) {
            HashSet<String> cookies = new HashSet<>();

            for (String header : originalResponse.headers("Set-Cookie")) {
                cookies.add(header);
            }

            ShareManager.setSetValues(mContext, "config", cookies);
        }

        return originalResponse;
    }
}
