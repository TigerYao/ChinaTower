package com.ztesoft.baselib.netutils;


import android.content.Context;
import android.text.TextUtils;

import com.google.gson.Gson;
import com.ztesoft.baselib.constant.BaseConstant;
import com.ztesoft.baselib.utils.DesUtil;
import com.ztesoft.baselib.utils.LogUtils;
import com.ztesoft.baselib.utils.ShareManager;

import java.io.IOException;
import java.nio.charset.Charset;

import okhttp3.FormBody;
import okhttp3.Interceptor;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;
import okio.Buffer;
import okio.BufferedSource;

/**
 * token 拦截器
 *
 * @author by kohui
 * @version 1.0
 * @date 16/10/12
 */
public class TokenInterceptor implements Interceptor {


    private static final Charset UTF8 = Charset.forName("UTF-8");

    private Context mContext;

    public TokenInterceptor(Context context) {
        this.mContext = context;
    }

    @Override
    public Response intercept(Chain chain) throws IOException {
        Request request = chain.request();

        // try the request
        Response originalResponse = chain.proceed(request);

        /**通过如下的办法曲线取到请求完成的数据
         *
         * 原本想通过  originalResponse.body().string()
         * 去取到请求完成的数据,但是一直报错,不知道是okhttp的bug还是操作不当
         *
         * 然后去看了okhttp的源码,找到了这个曲线方法,取到请求完成的数据后,根据特定的判断条件去判断token过期
         */

        ResponseBody responseBody = originalResponse.body();
        BufferedSource source = responseBody.source();
        source.request(Long.MAX_VALUE); // Buffer the entire body.
        Buffer buffer = source.buffer();
        Charset charset = UTF8;
        MediaType contentType = responseBody.contentType();
        if (contentType != null) {
            charset = contentType.charset(UTF8);
        }

        String bodyString = buffer.clone().readString(charset);

        LogUtils.e("huhui", "body---------->" + bodyString);
        /***************************************/

        if (bodyString.contains("校验过期") || bodyString.contains("校验无效")) {
            //根据和服务端的约定判断token过期
            String token = null;
            OkHttpClient client = new OkHttpClient();
            String mobile = ShareManager.getValue(mContext, ShareManager.KEY_USERPHONE);
            String password = ShareManager.getValue(mContext, ShareManager.KEY_USER_PW);
            password = DesUtil.decode(password);
            String machine_code = null;

            if (TextUtils.isEmpty(mobile) || TextUtils.isEmpty(password)) {
                return originalResponse;
            }
            RequestBody body = new FormBody.Builder().add("mobile", mobile).add("password", password)
                    .add("machine_code", machine_code).add("type", "1").build();

            String url = HRetrofitNetHelper.BASE_URL + "rest/user/login";
            Request requestToken = new Request.Builder().url(url).post(body).build();
            try {
                Response response = client.newCall(requestToken).execute();
                if (response.isSuccessful()) {
                    String result = response.body().string();
                    Gson gson = new Gson();
                    BaseRespToken baseResp = gson.fromJson(result, BaseRespToken.class);
                    if (baseResp.getData() != null && baseResp.getData().getToken() != null) {
                        LogUtils.e("huhui", "在次执行---data------->" + baseResp.getData().getToken());
                        token = baseResp.getData().getToken();
                        ShareManager.setValue(mContext, BaseConstant.TOKEN, token);
                    } else {
                        ShareManager.setValue(mContext, BaseConstant.TOKEN, "");

                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
            if (TextUtils.isEmpty(token)) {
                return originalResponse;
            }

            LogUtils.e("huhui", "在次执行---------->" + token);

            Request newRequest = request.newBuilder().header("token", token)
                    .build();
            originalResponse.body().close();
            return chain.proceed(newRequest);
        }

        // otherwise just pass the original response on
        return originalResponse;
    }

}
