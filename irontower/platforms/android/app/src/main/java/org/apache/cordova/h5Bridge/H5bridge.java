package org.apache.cordova.h5Bridge;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.content.res.AssetFileDescriptor;
import android.media.MediaPlayer;
import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;

import com.alipay.sdk.app.AuthTask;
import com.alipay.sdk.app.PayTask;
import com.baidu.location.BDLocation;
import com.chinatower.fghd.customer.MainActivity;
import com.chinatower.fghd.customer.api.ITowerBusiness;
import com.chinatower.fghd.customer.home.HomeActivity;
import com.chinatower.fghd.customer.live.FaceLivenessExpActivity;
import com.chinatower.fghd.customer.location.BDLocationUtils;
import com.chinatower.fghd.customer.location.NaviPopWindow;
import com.chinatower.fghd.customer.scan.ScannerHelper;
import com.chinatower.fghd.customer.share.ShareActivity;
import com.chinatower.fghd.customer.update.UpdateDialog;
import com.chinatower.fghd.customer.util.APKVersionCodeUtils;
import com.chinatower.fghd.customer.util.UserInfoUtils;
import com.chinatower.fghd.customer.vo.AuthResult;
import com.chinatower.fghd.customer.vo.GpsInfo;
import com.chinatower.fghd.customer.vo.JpushTypeBean;
import com.chinatower.fghd.customer.vo.MethodBean;
import com.chinatower.fghd.customer.vo.NaviBean;
import com.chinatower.fghd.customer.vo.NotificationNativeBean;
import com.chinatower.fghd.customer.vo.PayMsg;
import com.chinatower.fghd.customer.vo.PayResult;
import com.chinatower.fghd.customer.vo.ScanBean;
import com.chinatower.fghd.customer.vo.ShareMsg;
import com.chinatower.fghd.customer.vo.ToJsPathBean;
import com.chinatower.fghd.customer.vo.UserInfo;
import com.chinatower.fghd.customer.vo.WXPayInfo;
import com.chinatower.fghd.customer.vo.WebBean;
import com.chinatower.fghd.customer.vo.home.AppVersion;
import com.chinatower.fghd.customer.vo.home.QueryAppVersion;
import com.chinatower.fghd.customer.web.AgreementActivity;
import com.chinatower.fghd.customer.web.WebViewActivity;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.tencent.mm.opensdk.modelpay.PayReq;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import com.ztesoft.baselib.base.BaseActivity;
import com.ztesoft.baselib.netutils.BaseResp;
import com.ztesoft.baselib.netutils.HRetrofitNetHelper;
import com.ztesoft.baselib.utils.LogUtils;
import com.ztesoft.baselib.views.ToastView;
import com.ztesoft.baselib.views.dialog.SpotsDialog;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.LOG;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Map;

import cn.jpush.android.api.JPushInterface;
import me.devilsen.czxing.code.BarcodeFormat;
import retrofit2.Call;

//import com.baidu.idl.face.platform.FaceConfig;
//import com.baidu.idl.face.platform.FaceEnvironment;
//import com.baidu.idl.face.platform.FaceSDKManager;

/**
 * @auther EnzoChan
 * created:2020-03-31
 * desc:
 */
public class H5bridge extends CordovaPlugin {
    String TAG = this.getClass().getSimpleName();

    public static final int REQUEST_CODE_LIVE = 189;

    public static final String WX_ACTION = "wx_action";
    public static final String SCAN_ACTION = "scan_action";
    public static final String JPUSH_ACTION = "jpush_action";
    public static final String JPUSH_DATA_ACTION = "jpush_data_action";
    public static final String CLICK_TO_PAGE_ACTION = "click_to_page_action";
    public static final String HOME_UPDATE_USER_INFO_ACTION = "home_update_user_info_action";
    public static final String HOME_UPDATE_ANNOTATION_ACTION = "home_update_annotation_action";
    private Context context;
    public CallbackContext callback;

    private static final int SDK_PAY_FLAG = 1;
    private static final int SDK_AUTH_FLAG = 2;

    private static Activity mActivity;

    private static H5bridge instance;

    private double myLongitude, myLatitude;

    private ScanBean scanBean;


    public H5bridge() {
        instance = this;
    }

    @Override
    protected void pluginInitialize() {
        super.pluginInitialize();
        LogUtils.d("ckf", " H5bridge pluginInitialize");
        initH5Receiver(CLICK_TO_PAGE_ACTION, JPUSH_ACTION);
    }

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        mActivity = cordova.getActivity();
        Log.d(TAG, "initialize");

    }


    public static void transmitNotificationOpen(JpushTypeBean jpushTypeBean) {
        Log.d("H5bridge", "transmitNotificationOpen" + instance);
        if (instance == null) {
            return;
        }
        String type = jpushTypeBean.getType();
        Log.d("H5bridge", "transmitNotificationOpen" + type);
        Gson mGson = new Gson();

        String jsFunction = null;
        if (type.equals("1") || type.equals("0")) {
            ToJsPathBean toJsPathBean = new ToJsPathBean();
            toJsPathBean.setPathname("/myWallet/tradingDetail");
            String json = mGson.toJson(toJsPathBean);
            jsFunction = "window.pushToPage('" + json + "')";
        } else if ("".equals(type)) {
            jsFunction = "window.pushToPage('" + type + "')";
        } else if (type.startsWith("5")) {
            jsFunction = "window.pushToPage('" + jpushTypeBean.getType() + "'," + jpushTypeBean.getNoticeId() + ")";

//            jsFunction = "window.pushToPage('" + mGson.toJson(jpushTypeBean) + "')";
        }
        String finalJsFunction = jsFunction;
        mActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                instance.webView.loadUrl("javascript:" + finalJsFunction);
            }
        });

    }


    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        LOG.d(TAG, "We are entering execute action->" + action + "   json-> " + args.toString());
        callback = callbackContext;
        context = webView.getContext();
        if (action.equals("pay")) {
            //支付
            Gson mGson = new Gson();
            String json = args.getString(0);
            PayMsg payMsg = mGson.fromJson(json, PayMsg.class);
            if (payMsg.getType().equals("Wechat")) {
                WXPayInfo mWXPayInfo = mGson.fromJson(payMsg.getOrderString().toString(), WXPayInfo.class);
                payByWx(mWXPayInfo);
                initWXReceiver();
            } else {
                payByAli(payMsg.getOrderString().toString());
            }
            return true;

        } else if (action.equals("share")) {
            // 分享
            Gson mGson = new Gson();
            String json = args.getString(0);
            ShareMsg shareMsg = mGson.fromJson(json, ShareMsg.class);

            ShareActivity.startActivity(context, shareMsg);
            initWXReceiver();
//            requestPermissionForLive();

            return true;

        } else if (action.equals("setJpushAlias")) {
            //// 设置激光推送标识
            String tags = args.getString(0);
            JPushInterface.setAlias(context, 1, tags);
            return true;
        } else if (action.equals("clearJpushAlias")) {
            // 清空激光推送标识
            JPushInterface.cleanTags(context, 1);
            JPushInterface.stopPush(context);
            return true;
        } else if (action.equals("playMedia")) {
            // 播放音频
            openAssetMusics();
            return true;

        } else if (action.equals("pushWebviewWithUrl")) {
            // 调用wkwebview页面
            webView.loadUrl(args.getString(0));
            return true;

        } else if (action.equals("goOtherMap")) {
            //// 跳转到其他地图平台 如：百度，高德
            return true;

        } else if (action.equals("scanQRCode")) {
            Gson mGson = new Gson();
            String json = args.getString(0);
            scanBean = mGson.fromJson(json, ScanBean.class);
            // 打开扫描功能
            requestPermission();
            return true;

        } else if (action.equals("openAntFi")) {
            //// 支付宝授权
            Gson mGson = new Gson();
            String json = args.getString(0);
            PayMsg payMsg = mGson.fromJson(json, PayMsg.class);

            openAnt(payMsg.getOrderString().toString());
            return true;
        } else if (action.equals("openMapApp")) {
            //打开地图导航功能
            Gson mGson = new Gson();
            NaviBean mNaviBean = mGson.fromJson(args.getString(0), NaviBean.class);
            if (mNaviBean != null) {
                NaviPopWindow.show(mActivity, webView.getView(), mNaviBean, myLatitude, myLongitude);

            }
            return true;
        } else if (action.equals("commonFunc")) {
            //// 调用原生的公用方法
            Gson mGson = new Gson();
            MethodBean mMethodBean = mGson.fromJson(args.getString(0), MethodBean.class);
            if (mMethodBean.getMethod().equals("getCurrentPosition")) {
                //定位
//                getCurrentPosition();
                return true;
            } else if (mMethodBean.getMethod().equals("getAppDeviceModel")) {
                //设备名称
                callback.success(APKVersionCodeUtils.getDeviceMobile());
                return true;
            } else if (mMethodBean.getMethod().equals("canOpenWx")) {
                //是否安装微信
                Boolean isInstall = APKVersionCodeUtils.checkAppInstalled(context,
                        "com.tencent.mm");
                callback.success(isInstall ? 1 : 0);
                return true;
            } else if (mMethodBean.getMethod().equals("canOpenAli")) {
                //是否安装支付宝
                Boolean isInstall = APKVersionCodeUtils.isAliPayInstalled(context);
                callback.success(isInstall ? 1 : 0);
                return true;
            } else if (mMethodBean.getMethod().equals("getAppVersion")) {
                //获取应用版本名
                callbackContext.success(APKVersionCodeUtils.getVerName(context));
                return true;

            } else if (mMethodBean.getMethod().equals("openWebView")) {
                //打开webView
                Type type = new TypeToken<MethodBean<WebBean>>() {
                }.getType();
                MethodBean<WebBean> mMethodBean1 = mGson.fromJson(args.getString(0), type);

                if (mMethodBean1.getParams() != null && mMethodBean1.getParams().getUrl() != null && isDownFile(mMethodBean1.getParams().getUrl())) {
                    AgreementActivity.startActivity(context, mMethodBean1.getParams());
                } else {
                    WebViewActivity.startActivity(context, mMethodBean1.getParams());
                }

                return true;
            } else if (mMethodBean.getMethod().equals("goMapView")) {
                Type type = new TypeToken<MethodBean<UserInfo>>() {
                }.getType();
                MethodBean<UserInfo> userInfoMethodBean = mGson.fromJson(args.getString(0), type);


                //保存用户信息
                UserInfoUtils.setUserInfo(context, userInfoMethodBean.getParams());

                //跳转到HomeActivity

                startHome();
                /**
                 *
                 * 页面跳转也会导致插件销毁
                 */
                if (mActivity != null) {
                    mActivity.finish();
                    mActivity.overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);

                }
            } else if (mMethodBean.getMethod().equals("popToView")) {

//                startHome();
                if (mActivity != null) {
                    mActivity.finish();
                    mActivity.overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);

                }
            } else if (mMethodBean.getMethod().equals("notificationNative")) {
                //发送通知
                Type type = new TypeToken<MethodBean<NotificationNativeBean>>() {
                }.getType();
                MethodBean<NotificationNativeBean> mNotificationNativeBean = mGson.fromJson(args.getString(0), type);
                if (mNotificationNativeBean.getParams().getKey().equals("updateAnnotation")) {
                    //
                    Intent mIntent = new Intent();
                    mIntent.setAction(HOME_UPDATE_ANNOTATION_ACTION);
                    context.sendBroadcast(mIntent);
                } else if (mNotificationNativeBean.getParams().getKey().equals("updateUser")) {
                    Intent mIntent = new Intent();
                    mIntent.setAction(HOME_UPDATE_USER_INFO_ACTION);
                    context.sendBroadcast(mIntent);
                }

            } else if (mMethodBean.getMethod().equals("showUpdateView")) {
                //检测更新
                queryUpgrade();
            }


        }
        return false;
    }


    /**
     * 检测更新
     *
     * @param isShowToast
     */
    private void queryUpgrade() {
         SpotsDialog mDialog = new SpotsDialog(context);

        HRetrofitNetHelper retrofitNetHelper = HRetrofitNetHelper.getInstance(context);

        ITowerBusiness iCloudBusiness = retrofitNetHelper.getAPIService(ITowerBusiness.class);


        Call<BaseResp<AppVersion>> call = iCloudBusiness.queryUpgrade(new QueryAppVersion("exchange_android"));

        mDialog.show();
        retrofitNetHelper.enqueueCall(call, new HRetrofitNetHelper.RetrofitCallBack<AppVersion>() {
            @Override
            public void onSuccess(BaseResp<AppVersion> baseResp) {
                mDialog.cancel();
                AppVersion appVersion = baseResp.getResultObject();

                Integer localVersion = APKVersionCodeUtils.getVersionCode(context);
                try {
                    if (Integer.parseInt(appVersion.getAppVersionNo()) > localVersion) {

                        UpdateDialog dialog = new UpdateDialog(context);
                        dialog.setAppVersion(appVersion);
                        dialog.show();

                    } else {
                        ToastView.showLong("您目前版本最新版本");
                    }
                } catch (Exception e) {

                }


            }

            @Override
            public void onFailure(String error) {
                mDialog.cancel();
                ToastView.showLong(error);
            }
        });
    }


    public void startHome() {
        Intent mIntent = new Intent(context, HomeActivity.class);
        mIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        ((Activity) context).startActivityForResult(mIntent, 1024);
        ((Activity) context).overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);

    }

    private boolean isDownFile(String url) {
        return url.contains(".doc") || url.contains(".docx") || url.contains("xls") || url.contains("xlsx");
    }

    @Override
    public void onDestroy() {
        Log.d("ckf", "H5bridge destory");
        super.onDestroy();
        if (mWxBroadcastReceiver != null) {
            webView.getContext().unregisterReceiver(mWxBroadcastReceiver);
        }
        if (mH5BroadcastReceiver != null) {
            webView.getContext().unregisterReceiver(mH5BroadcastReceiver);
        }


    }

    WxBroadcastReceiver mWxBroadcastReceiver;

    public void initWXReceiver() {
        mWxBroadcastReceiver = new WxBroadcastReceiver();
        IntentFilter filter = new IntentFilter(WX_ACTION);
        webView.getContext().registerReceiver(mWxBroadcastReceiver, filter);
    }

    public class WxBroadcastReceiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
            Integer resultCode = intent.getIntExtra("resultCode", -1);
            String errorStr = intent.getStringExtra("errorStr");
            if (resultCode == 0) {
                callback.success();
                Intent mIntent = new Intent();
                mIntent.setAction(HOME_UPDATE_USER_INFO_ACTION);
                context.sendBroadcast(mIntent);
            } else {
                callback.error(errorStr);
            }

        }
    }


    H5BroadcastReceiver mH5BroadcastReceiver;

    public void initH5Receiver(String... action) {
        mH5BroadcastReceiver = new H5BroadcastReceiver();
        IntentFilter filter = new IntentFilter();

        for (String s : action) {
            filter.addAction(s);
        }
        webView.getContext().registerReceiver(mH5BroadcastReceiver, filter);
    }

    public class H5BroadcastReceiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
            Log.d(TAG, "H5BroadcastReceiver onReceive");
            if (intent.getAction().equals(SCAN_ACTION)) {
                String resultContent = intent.getStringExtra("resultContent");

                if (TextUtils.isEmpty(resultContent)) {
                    callback.error("扫码错误");
                } else {
                    callback.success(resultContent);
                }
            } else if (intent.getAction().equals(JPUSH_ACTION)) {
                JpushTypeBean jpushTypeBean = (JpushTypeBean) intent.getSerializableExtra("data");

                transmitNotificationOpen(jpushTypeBean);
            } else if (intent.getAction().equals(JPUSH_DATA_ACTION)) {
                JpushTypeBean jpushTypeBean = (JpushTypeBean) intent.getSerializableExtra("data");
                transmitNotificationQueryData(jpushTypeBean);
//                String type = intent.getStringExtra("data");
                transmitNotificationOpen(jpushTypeBean);
            } else if (intent.getAction().equals(CLICK_TO_PAGE_ACTION)) {
                if (webView == null) {
                    Intent mIntent = new Intent(context, MainActivity.class);
                    context.startActivity(mIntent);
                }
                webView.loadUrl("/news/noNews");
            }


        }
    }

    private void transmitNotificationQueryData(JpushTypeBean jpushTypeBean) {
        Log.d(TAG, "transmitNotificationQueryData" + jpushTypeBean.getType());
        String jsFunction = null;
        Gson mGson = new Gson();
        if (jpushTypeBean.getType().startsWith("5")) {
            jsFunction = "window.pushToQueryData('" + mGson.toJson(jpushTypeBean) + "')";
        }
        Log.d(TAG, jsFunction);
        String finalJsFunction = jsFunction;
        mActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                instance.webView.loadUrl("javascript:" + finalJsFunction);
            }
        });
    }

    /**
     * 通过GPS获取定位信息
     */
    public void getCurrentPosition() {
        boolean isEnable = context.checkCallingOrSelfPermission("android.permission.ACCESS_COARSE_LOCATION") == PackageManager.PERMISSION_GRANTED ||
                context.checkCallingOrSelfPermission("android.permission.ACCESS_FINE_LOCATION") == PackageManager.PERMISSION_GRANTED;
        if (!isEnable) {
            callback.error("暂无定位权限");
            cordova.requestPermission(this, 1002, Manifest.permission.ACCESS_COARSE_LOCATION);
            cordova.requestPermission(this, 1003, Manifest.permission.ACCESS_FINE_LOCATION);
        } else {
            getGpsLocation();
        }
    }

    private void getGpsLocation() {
        BDLocationUtils utils = BDLocationUtils.getInstance(context);
        utils.startMonitor();
        utils.setLocationListener(new BDLocationUtils.ILocationListener() {
            @Override
            public void onSuccessLocation(BDLocation location) {
                Log.d(TAG, "onSuccessLocation");
                myLatitude = location.getLatitude();
                myLongitude = location.getLongitude();
                GpsInfo gpsInfo = new GpsInfo(location.getLongitude(), location.getLatitude());
                gpsInfo.setPlatform("Android");
                gpsInfo.setAddress(location.getAddrStr());
                gpsInfo.setArea(location.getDistrict());
                gpsInfo.setPrivce(location.getProvince());
                gpsInfo.setCity(location.getCity());
                gpsInfo.setCounty(location.getCountry());
                Gson mGson = new Gson();
                String json = mGson.toJson(gpsInfo);
                JSONObject jsonObject = null;
                try {
                    jsonObject = new JSONObject(json);
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                PluginResult result = new PluginResult(PluginResult.Status.OK, jsonObject);
                if (callback != null) {
                    callback.sendPluginResult(result);

                }
            }

            @Override
            public void onErrorLocation(String errorMsg) {
                Log.d(TAG, "onErrorLocation  --->" + errorMsg);
                callback.error(errorMsg);
            }
        });
    }

    MediaPlayer mediaPlayer;

    /**
     * 播放低电量
     */
    private void openAssetMusics() {

        try {
            //播放 assets/a2.mp3 音乐文件
            AssetFileDescriptor fd = context.getAssets().openFd("eleVoice.aiff");
            mediaPlayer = new MediaPlayer();
            mediaPlayer.setDataSource(fd.getFileDescriptor(), fd.getStartOffset(), fd.getLength());
            mediaPlayer.prepare();
            mediaPlayer.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void requestPermission() {
        boolean isEnable = context.checkCallingOrSelfPermission("android.permission.CAMERA") == PackageManager.PERMISSION_GRANTED;
        if (!isEnable) {
            cordova.requestPermission(this, 1001, Manifest.permission.CAMERA);
        } else {
            goScanner();
        }

    }

    private void requestPermissionForLive() {
        boolean isEnable = context.checkCallingOrSelfPermission("android.permission.CAMERA") == PackageManager.PERMISSION_GRANTED;
        if (!isEnable) {
            cordova.requestPermission(this, 1004, Manifest.permission.CAMERA);
        } else {
            toLive();
        }

    }

    //跳转到活体检测
    private void toLive() {
        initLib();
        setFaceConfig();
        Intent mIntent = new Intent(context, FaceLivenessExpActivity.class);
        cordova.getActivity().startActivityForResult(mIntent, REQUEST_CODE_LIVE);
    }

    /**
     * 初始化SDK
     */
    private void initLib() {
        // 为了android和ios 区分授权，appId=appname_face_android ,其中appname为申请sdk时的应用名
        // 应用上下文
        // 申请License取得的APPID
        // assets目录下License文件名
//        FaceSDKManager.getInstance().initialize(context, Constant.licenseID, Constant.licenseFileName);
        // setFaceConfig();
    }

    private void setFaceConfig() {
//        FaceConfig config = FaceSDKManager.getInstance().getFaceConfig();
//        // SDK初始化已经设置完默认参数（推荐参数），您也根据实际需求进行数值调整
//        config.setLivenessTypeList(Arrays.asList(Constant.LIVENESSLIST));
//        config.setLivenessRandom(Constant.IS_LIVENESS_RANDOM);
//        config.setBlurnessValue(FaceEnvironment.VALUE_BLURNESS);
//        config.setBrightnessValue(FaceEnvironment.VALUE_BRIGHTNESS);
//        config.setCropFaceValue(FaceEnvironment.VALUE_CROP_FACE_SIZE);
//        config.setHeadPitchValue(FaceEnvironment.VALUE_HEAD_PITCH);
//        config.setHeadRollValue(FaceEnvironment.VALUE_HEAD_ROLL);
//        config.setHeadYawValue(FaceEnvironment.VALUE_HEAD_YAW);
//        config.setMinFaceSize(FaceEnvironment.VALUE_MIN_FACE_SIZE);
//        config.setNotFaceValue(FaceEnvironment.VALUE_NOT_FACE_THRESHOLD);
//        config.setOcclusionValue(FaceEnvironment.VALUE_OCCLUSION);
//        config.setCheckFaceQuality(true);
//        config.setFaceDecodeNumberOfThreads(2);
//
//        FaceSDKManager.getInstance().setFaceConfig(config);
    }

    @Override
    public void onRequestPermissionResult(int requestCode, String[] permissions, int[] grantResults) throws JSONException {
        super.onRequestPermissionResult(requestCode, permissions, grantResults);

        if (requestCode == 1001) {
            //扫码
            goScanner();
        } else if (requestCode == 1003) {
            getGpsLocation();
        } else if (requestCode == 1004) {
            toLive();
        }
    }

    /**
     * 扫码
     */
    private void goScanner() {
//        Intent intent = ScannerActivity.getIntent(context, true,
//                ScannerActivity.EXTRA_LASER_LINE_MODE_0, ScannerActivity.EXTRA_SCAN_MODE_1,
//                false, false, false, scanBean.getTitle());
//        cordova.setActivityResultCallback(this);
//        cordova.getActivity().startActivityForResult(intent, ScannerActivity.REQUEST_CODE_SCANNER);
//        initH5Receiver(SCAN_ACTION);

        ScannerHelper.openScan(context, scanBean.getTitle(), new ScannerHelper.ScannerCallback() {
            @Override
            public void onScanResult(Activity activity, String result, BarcodeFormat format) {
                Log.d(TAG, result);
                callback.success(result);
            }
        });
    }


    /**
     * 微信支付
     *
     * @param
     */
    private void payByWx(WXPayInfo info) {
        //旧的appId wxe6b4508da29eeb85
        IWXAPI api = WXAPIFactory.createWXAPI(context, "wxdc946658fe1c020a");
        PayReq req = new PayReq();
        req.appId = info.getAppid();
        req.partnerId = info.getPartnerId();
        req.prepayId = info.getPrepayId();
        req.nonceStr = info.getNonceStr();
        req.timeStamp = info.getTimeStamp();
        req.packageValue = "Sign=WXPay";
        req.sign = info.getSign();
        boolean isTrue = api.sendReq(req);

    }

    @SuppressLint("HandlerLeak")
    private Handler mHandler = new Handler() {
        @SuppressWarnings("unused")
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case SDK_PAY_FLAG: {
                    @SuppressWarnings("unchecked")
                    PayResult payResult = new PayResult((Map<String, String>) msg.obj);
                    /**
                     * 对于支付结果，请商户依赖服务端的异步通知结果。同步通知结果，仅作为支付结束的通知。
                     */
                    String resultInfo = payResult.getResult();// 同步返回需要验证的信息
                    String resultStatus = payResult.getResultStatus();
                    PluginResult result = null;
                    // 判断resultStatus 为9000则代表支付成功
                    if (TextUtils.equals(resultStatus, "9000")) {
                        // 该笔订单是否真实支付成功，需要依赖服务端的异步通知。
                        Intent mIntent = new Intent();
                        mIntent.setAction(HOME_UPDATE_USER_INFO_ACTION);
                        context.sendBroadcast(mIntent);
                        result = new PluginResult(PluginResult.Status.OK, resultInfo);
                    } else {
                        // 该笔订单真实的支付结果，需要依赖服务端的异步通知。
                        result = new PluginResult(PluginResult.Status.ERROR, resultInfo);

                    }
                    callback.sendPluginResult(result);

                    break;
                }

                case SDK_AUTH_FLAG: {
                    @SuppressWarnings("unchecked")
                    AuthResult authResult = new AuthResult((Map<String, String>) msg.obj, true);
                    String resultStatus = authResult.getResultStatus();

                    // 判断resultStatus 为“9000”且result_code
                    // 为“200”则代表授权成功，具体状态码代表含义可参考授权接口文档 && TextUtils.equals(authResult.getResultCode(), "200")
                    PluginResult result = null;
                    if (TextUtils.equals(resultStatus, "9000")) {
                        // 获取alipay_open_id，调支付时作为参数extern_token 的value
                        // 传入，则支付账户为该授权账户
                        result = new PluginResult(PluginResult.Status.OK, authResult.getResult());
                    } else {
                        // 其他状态值则为授权失败
                        result = new PluginResult(PluginResult.Status.ERROR, authResult.getResult());
                    }
                    callback.sendPluginResult(result);
                    break;
                }

                default:
                    break;
            }
        }

        ;
    };

    private void openAnt(String authInfo) {
        Runnable authRunnable = new Runnable() {

            @Override
            public void run() {
                // 构造AuthTask 对象
                AuthTask authTask = new AuthTask(cordova.getActivity());
                // 调用授权接口，获取授权结果
                Map<String, String> result = authTask.authV2(authInfo, true);

                Message msg = new Message();
                msg.what = SDK_AUTH_FLAG;
                msg.obj = result;
                mHandler.sendMessage(msg);
            }
        };

        // 必须异步调用
        Thread authThread = new Thread(authRunnable);
        authThread.start();

    }

    /**
     * 支付宝支付
     *
     * @param url
     */
    private void payByAli(String url) {

        final Runnable payRunnable = new Runnable() {

            @Override
            public void run() {
                PayTask alipay = new PayTask(cordova.getActivity());
                Map<String, String> result = alipay.payV2(url, true);
                Message msg = new Message();
                msg.what = SDK_PAY_FLAG;
                msg.obj = result;
                mHandler.sendMessage(msg);
            }
        };

        // 必须异步调用
        Thread payThread = new Thread(payRunnable);
        payThread.start();
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {

//        if (requestCode == ScannerActivity.REQUEST_CODE_SCANNER && resultCode == Activity.RESULT_OK) {
//
//            String content = intent.getStringExtra(Scanner.Scan.RESULT);
//            callback.success(content);
//        if (requestCode == ScannerActivity.REQUEST_CODE_SCANNER
//                && resultCode == Activity.RESULT_OK) {
//
////            String content = intent.getStringExtra(Scanner.Scan.RESULT);
////            callback.success(content);
//
//        } else if (requestCode == REQUEST_CODE_LIVE && resultCode == Activity.RESULT_OK) {
//
//        }
    }
}

