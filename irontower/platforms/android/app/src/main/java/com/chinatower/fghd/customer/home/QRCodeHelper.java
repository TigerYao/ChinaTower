package com.chinatower.fghd.customer.home;

import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;

import com.chinatower.fghd.customer.api.ITowerBusiness;
import com.chinatower.fghd.customer.util.UserInfoUtils;
import com.chinatower.fghd.customer.vo.home.ExchangePowerBusinessResultVo;
import com.chinatower.fghd.customer.vo.home.ExchangePowerBusinessVo;
import com.chinatower.fghd.customer.vo.home.OperateOfflineCabinetExcVo;
import com.chinatower.fghd.customer.vo.home.QRCodeAnalysisBean;
import com.chinatower.fghd.customer.vo.home.UserDetailInfo;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.ztesoft.baselib.netutils.BaseResp;
import com.ztesoft.baselib.netutils.HRetrofitNetHelper;
import com.ztesoft.baselib.utils.RegExUtils;
import com.ztesoft.baselib.views.ToastView;

import me.devilsen.czxing.code.BarcodeFormat;
import retrofit2.Call;

/**
 * @auther EnzoChan
 * created:2020/8/27
 * desc:二维码解析助手
 */
public class QRCodeHelper {

    private Context mContext;

    private static QRCodeHelper mQRCodeHelper;

    QRCodeHelperListener mQRCodeHelperListener;

    public void setQRCodeHelperListener(QRCodeHelperListener mQRCodeHelperListener) {
        this.mQRCodeHelperListener = mQRCodeHelperListener;
    }

    public interface QRCodeHelperListener {
        void toQueryBattery();
    }

    private final String QRCODE_ERROR = "二维码错误";
    private final String QRCODE_UN_ENABLE = "暂不支持邮政电池类型";

    public QRCodeHelper() {

    }

    public static QRCodeHelper getInstance(Context mContext) {
        if (mQRCodeHelper == null) {
            mQRCodeHelper = new QRCodeHelper();
        }

        return mQRCodeHelper;
    }


    private void sendMsg(String content) {
        //扫码子线程返回
        ((Activity) mContext).runOnUiThread(new Runnable() {
            @Override
            public void run() {
                ToastView.showLong(content);
            }
        });

    }

    public void qrCodeAnalysis(String content, Context mContext) {
        this.mContext = mContext;
        String code = null;
        if (TextUtils.isEmpty(content) || RegExUtils.isContainChinese(content)) {
            sendMsg(QRCODE_ERROR);
            return;
        } else if (isJson(content)) {
            Gson mGson = new Gson();
            QRCodeAnalysisBean mBean = mGson.fromJson(content, QRCodeAnalysisBean.class);
            if (mBean != null) {
                code = mBean.getCode();
            } else {
                sendMsg(QRCODE_ERROR);
                return;
            }
        } else if (content.contains("BT")) {
            String tempCode = content.split("BT")[1];
            if (tempCode.length() >= 26 && tempCode.contains(",") && !RegExUtils.isContainChinese(tempCode)) {
                sendMsg(QRCODE_UN_ENABLE);
                return;

            } else {
                sendMsg(QRCODE_ERROR);

                return;

            }
        } else {
            code = content;
        }
        if (code.length() > 30) {
            //离线换电
            operateOfflineCabinetExc(code);
        } else {
            //正常换电
            exchangePowerBusiness(code);
        }
    }

    private void exchangePowerBusiness(String code) {
        HRetrofitNetHelper retrofitNetHelper = HRetrofitNetHelper.getInstance(mContext);
        ITowerBusiness iCloudBusiness = retrofitNetHelper.getAPIService(ITowerBusiness.class);

        UserDetailInfo userDetailInfo = UserInfoUtils.getUserDetailInfo(mContext);

        ExchangePowerBusinessVo mExchangePowerBusinessVo = ExchangePowerBusinessVo.getExchangePowerBusinessVo(userDetailInfo);
        mExchangePowerBusinessVo.setCabinetId(code);

        Call<BaseResp<ExchangePowerBusinessResultVo>> call = iCloudBusiness.exchangePowerBusiness(UserInfoUtils.getUserInfo(mContext).getBearerToken(), mExchangePowerBusinessVo);

        retrofitNetHelper.enqueueCall(call, new HRetrofitNetHelper.RetrofitCallBack<ExchangePowerBusinessResultVo>() {
            @Override
            public void onSuccess(BaseResp<ExchangePowerBusinessResultVo> baseResp) {

                ExchangePowerBusinessResultVo resultVo = baseResp.getResultObject();

                if (resultVo != null) {
                    if (resultVo.getCode().equals("1")) {
                        if (resultVo.getMsg().equals("扫机柜成功请扫电池")) {
                            openScanActivity();
                        } else {
                            //查询电池
                            if (mQRCodeHelperListener != null) {
                                mQRCodeHelperListener.toQueryBattery();
                            }
                        }
                    } else {
                        //查询电池
                        if (mQRCodeHelperListener != null) {
                            mQRCodeHelperListener.toQueryBattery();
                        }
                    }

                    sendMsg(resultVo.getMsg());
//                    ToastView.showLong(resultVo.getMsg());
                }


            }

            @Override
            public void onFailure(String error) {
                sendMsg(error);
//                ToastView.showLong(error);
            }
        });
    }


    private void operateOfflineCabinetExc(String code) {
        HRetrofitNetHelper retrofitNetHelper = HRetrofitNetHelper.getInstance(mContext);
        ITowerBusiness iCloudBusiness = retrofitNetHelper.getAPIService(ITowerBusiness.class);

        UserDetailInfo userDetailInfo = UserInfoUtils.getUserDetailInfo(mContext);

        OperateOfflineCabinetExcVo mExchangePowerBusinessVo = OperateOfflineCabinetExcVo.getInstance(userDetailInfo);
        mExchangePowerBusinessVo.setExcCipherText(code);

        Call<BaseResp<ExchangePowerBusinessResultVo>> call = iCloudBusiness.operateOfflineCabinetExc(UserInfoUtils.getUserInfo(mContext).getBearerToken(), mExchangePowerBusinessVo);

        retrofitNetHelper.enqueueCall(call, new HRetrofitNetHelper.RetrofitCallBack<ExchangePowerBusinessResultVo>() {
            @Override
            public void onSuccess(BaseResp<ExchangePowerBusinessResultVo> baseResp) {

                ExchangePowerBusinessResultVo resultVo = baseResp.getResultObject();

                if (resultVo != null) {
                    if (resultVo.getCode().equals("1")) {
                        if (resultVo.getMsg().equals("扫机柜成功请扫电池")) {
                            openScanActivity();
                        } else {
                            //查询电池
                            if (mQRCodeHelperListener != null) {
                                mQRCodeHelperListener.toQueryBattery();
                            }
                        }
                    } else {
                        //查询电池
                        if (mQRCodeHelperListener != null) {
                            mQRCodeHelperListener.toQueryBattery();
                        }
                    }

                    ToastView.showLong(resultVo.getMsg());
                }


            }

            @Override
            public void onFailure(String error) {

                ToastView.showLong(error);
            }
        });
    }


    private void openScanActivity() {
//        Intent intent = ScannerActivity.getIntent(mContext, true,
//                ScannerActivity.EXTRA_LASER_LINE_MODE_0, ScannerActivity.EXTRA_SCAN_MODE_1,
//                false, false, false, "扫码换电");
//
//        ((Activity) mContext).startActivityForResult(intent, ScannerActivity.REQUEST_CODE_SCANNER);
        OpenScanActivityHelper mOpenScanActivityHelper = OpenScanActivityHelper.getInstance(mContext);
        mOpenScanActivityHelper.setmOnScanDelegate(new OpenScanActivityHelper.OnScanDelegate() {
            @Override
            public void onScanResult(Activity activity, String result, BarcodeFormat format) {

                //
                qrCodeAnalysis(result, mContext);
//                exchangePowerBusiness(result);
            }
        });
        mOpenScanActivityHelper.openScanActivity("扫码换电");
    }


    public static boolean isJson(String jsonStr) {
        JsonElement jsonElement;
        try {
            jsonElement = new JsonParser().parse(jsonStr);
        } catch (Exception e) {
            return false;
        }
        if (jsonElement == null) {
            return false;
        }
        if (!jsonElement.isJsonObject()) {
            return false;
        }
        return true;
    }

}
