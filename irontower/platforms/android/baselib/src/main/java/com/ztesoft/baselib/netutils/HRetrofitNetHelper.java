package com.ztesoft.baselib.netutils;

import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import com.ztesoft.baselib.constant.BaseConstant;
import com.ztesoft.baselib.utils.LogUtils;
import com.ztesoft.baselib.views.ToastView;

import java.io.File;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

import okhttp3.Cache;
import okhttp3.CacheControl;
import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import rx.Observable;
import rx.functions.Action1;
import rx.functions.Func1;


/**
 *
 */
public class HRetrofitNetHelper implements HttpLoggingInterceptor.Logger, Interceptor {
    public static HRetrofitNetHelper mInstance;
    private final Cache cache;
    public Retrofit mRetrofit;
    public OkHttpClient mOkHttpClient;
    public HttpLoggingInterceptor mHttpLogInterceptor;
    //    private BasicParamsInterceptor mBaseParamsInterceptor;
    private Interceptor mUrlInterceptor;
    private Context mContext;
    public Gson mGson;
    //            public static final String BASE_URL = "http://10.45.46.166:9999/ytx/ctm-server/";
//    public static final String WEB_SOCKET_URL = "http://10.45.46.166:9999";
//  public static final String BASE_URL = "http://180.153.60.153:8091"; // 测试地址
 // public static final String BASE_URL = "http://49.4.79.188:8091";//准生产
   public static final String BASE_URL  = "http://fx.chinatowercom.cn:8091"; // 生产地址

    private Action1<String> onNextAction;

    private HRetrofitNetHelper(Context context) {
        this.mContext = context;
        createSubscriberByAction();
        mGson = new GsonBuilder()
                .setDateFormat("yyyy-MM-dd HH:mm:ss")
                .create();
        mHttpLogInterceptor = new HttpLoggingInterceptor(this);
        mHttpLogInterceptor.setLevel(HttpLoggingInterceptor.Level.BODY);
        mUrlInterceptor = this;
        File cacheFile = new File(context.getCacheDir(), "HttpCache");
        cache = new Cache(cacheFile, 1024 * 1024 * 100); //100Mb
        mOkHttpClient = new OkHttpClient.Builder()
                .connectTimeout(12, TimeUnit.SECONDS)
                .writeTimeout(20, TimeUnit.SECONDS)
                .readTimeout(20, TimeUnit.SECONDS)
                .retryOnConnectionFailure(true)
//                .addInterceptor(new TokenInterceptor(context)) //添加token拦截器
                .addInterceptor(new AddCookiesInterceptor(context)) //添加token拦截器
                .addInterceptor(new ReceivedCookiesInterceptor(context)) //添加token拦截器
                .addInterceptor(mHttpLogInterceptor)
                .addInterceptor(mUrlInterceptor)
                // 看这里 ！！！ 我们添加了一个网络监听拦截器
//                .addInterceptor(new NetWorkInterceptor(context))
                .cache(cache)
                .build();
//        mOkHttpClient.interceptors().add(new TokenInterceptor());
        mRetrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create(mGson))
                .client(mOkHttpClient)
                .build();
    }

//    public static String getBaseUrl(){
//        return BASE_URL;
//    }
//
//    public static void setBaseUrl(String baseUrl){
//        BASE_URL = baseUrl;
//    }
    public static HRetrofitNetHelper getInstance(Context context) {
        if (mInstance == null) {
            synchronized (HRetrofitNetHelper.class) {
                if (mInstance == null) {
                    mInstance = new HRetrofitNetHelper(context);
                }
            }
        }
        return mInstance;
    }

    public <T> T getAPIService(Class<T> service) {
        return mRetrofit.create(service);
    }

    public <D> void enqueueCall(Call<BaseResp<D>> call, final RetrofitCallBack<D> retrofitCallBack) {
        call.enqueue(new Callback<BaseResp<D>>() {
            @Override
            public void onResponse(Call<BaseResp<D>> call, Response<BaseResp<D>> response) {
                BaseResp<D> resp = response.body();
                if (resp == null && response.errorBody() != null) {

                    try {
                        if (response.errorBody().contentType() != null && !response.errorBody().contentType().equals("text/html")) {
                            BaseResp<String> baseResp = mGson.fromJson(response.errorBody().string(), BaseResp.class);
                            if (baseResp != null && baseResp.getResultMsg() != null) {
                                if (baseResp.getCode().equals("401")) {
                                    ToastView.showLong(baseResp.getResultMsg());
                                    Intent mIntentBrocast = new Intent();
                                    mIntentBrocast.setAction(BaseConstant.FORCED_LOGIN_OUT_BROADCAST);
                                    mContext.sendBroadcast(mIntentBrocast);
                                } else {
                                    retrofitCallBack.onFailure(baseResp.getResultMsg());
                                }
                            }
                        } else {
                            retrofitCallBack.onFailure("暂时没有数据");

                        }
                    } catch (IOException e) {
                        e.printStackTrace();
//                        retrofitCallBack.onFailure(e.getMessage());
                        retrofitCallBack.onFailure("网络不通畅，请稍候再试");
                    } catch (JsonSyntaxException e) {
                        e.printStackTrace();
//                        retrofitCallBack.onFailure(e.getMessage());
                        retrofitCallBack.onFailure("网络不通畅，请稍候再试");

                    }
                    return;
                }
                if (resp.isSuccess()) {
                    if (retrofitCallBack != null)
                        retrofitCallBack.onSuccess(resp);
                } else {
                    if (retrofitCallBack != null) {
                        //重复请求直接过滤
                        if (resp.getCode().equals("401")) {
                            ToastView.showLong("您的登录已失效，请重新登录");
                            Intent mIntentBrocast = new Intent();
                            mIntentBrocast.setAction(BaseConstant.FORCED_LOGIN_OUT_BROADCAST);
                            mContext.sendBroadcast(mIntentBrocast);
                        } else {
                            retrofitCallBack.onFailure(resp.getResultMsg());
                        }

                    }
                }
            }

            @Override
            public void onFailure(Call<BaseResp<D>> call, Throwable t) {
                if (retrofitCallBack != null) {
                    if (t.toString().contains("failed to connect") || t.toString().contains("unexpected end of stream on okhttp3")) {
                        retrofitCallBack.onFailure("网络错误，请确认网络开启!");
                    } else {
//                        retrofitCallBack.onFailure(t.toString());
                        retrofitCallBack.onFailure("网络不通畅，请稍候再试");


                    }
                }
            }
        });
    }


    @Override
    public void log(String message) {
        LogUtils.d("NetUtils", "OkHttp: " + message);
    }

    @Override
    public okhttp3.Response intercept(Chain chain) throws IOException {
        Request request = chain.request();
        //缓存
        if (NetUtil.checkNetwork(mContext) == NetUtil.NO_NETWORK) {
            request = request.newBuilder()
                    .cacheControl(CacheControl.FORCE_CACHE)
                    .build();
            Log.d("NetUtils", "no network");
        }

        okhttp3.Response response = chain.proceed(request);
        Log.d("NetUtils", "NetUtil checkNetwork");
        //缓存响应
        if (NetUtil.checkNetwork(mContext) != NetUtil.NO_NETWORK) {
            //有网的时候读接口上的@Headers里的配置，你可以在这里进行统一的设置
            String cacheControl = request.cacheControl().toString();
            LogUtils.d("okhttp3", "cacheControl=====" + cacheControl);
            return response.newBuilder()
                    .header("Cache-Control", cacheControl)
                    .addHeader("Connection", "keep-alive")
                    .addHeader("Content-Type", "application/json")
                    .addHeader("Accept", "*/*")
//                    .removeHeader("Pragma")
                    .build();
        } else {
            LogUtils.e("okhttp3", "NetUtil checkNetwork is true");

            return response.newBuilder()
                    .addHeader("Connection", "keep-alive")
                    .addHeader("Content-Type", "application/json")
                    .addHeader("Accept", "*/*")
//                    .removeHeader("Pragma")
                    .build();
        }
    }


    public interface RetrofitCallBack<D> {
        void onSuccess(BaseResp<D> baseResp);

        void onFailure(String error);
    }

    private void createSubscriberByAction() {
        onNextAction = new Action1<String>() {
            @Override
            public void call(String s) {
                LogUtils.d("NetUtils", "s==========" + s);
                Toast.makeText(mContext, s, Toast.LENGTH_SHORT).show();
            }
        };
    }

    private void createObservable(String msg) {
        Observable.just(msg).map(new Func1<String, String>() {
            @Override
            public String call(String s) {
                return s;
            }
        })
                .subscribe(onNextAction);
    }

    public Cache getCache() {
        return cache;
    }

    public void clearCache() throws IOException {
        cache.delete();
    }


}
