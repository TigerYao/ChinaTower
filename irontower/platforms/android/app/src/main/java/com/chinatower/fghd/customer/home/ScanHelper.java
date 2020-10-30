package com.chinatower.fghd.customer.home;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.view.View;

import com.chinatower.fghd.customer.Constant.Constant;
import com.chinatower.fghd.customer.MainActivity;
import com.chinatower.fghd.customer.R;
import com.chinatower.fghd.customer.api.ITowerBusiness;
import com.chinatower.fghd.customer.util.UserInfoUtils;
import com.chinatower.fghd.customer.vo.home.FirstTakeBean;
import com.chinatower.fghd.customer.vo.home.QueryFirstTakeVo;
import com.chinatower.fghd.customer.vo.home.UserDetailInfo;
import com.ztesoft.baselib.netutils.BaseResp;
import com.ztesoft.baselib.netutils.HRetrofitNetHelper;
import com.ztesoft.baselib.views.RemindDialog;
import com.ztesoft.baselib.views.ToastView;

import me.devilsen.czxing.code.BarcodeFormat;
import retrofit2.Call;

/**
 * @auther EnzoChan
 * created:2020/8/27
 * desc: 扫码按钮相关
 */
public class ScanHelper {

    private Context mContext;
    private static ScanHelper scanHelper;

    private QRCodeHelper.QRCodeHelperListener mQRCodeHelperListener;

    private View view;

    public void setView(View view) {
        this.view = view;
    }

    public void setmQRCodeHelperListener(QRCodeHelper.QRCodeHelperListener mQRCodeHelperListener) {
        this.mQRCodeHelperListener = mQRCodeHelperListener;
    }

    private UserDetailInfo userDetailInfo;

    public ScanHelper() {
    }

    public static ScanHelper getInstance() {
        if (scanHelper == null) {
            scanHelper = new ScanHelper();
        }

        return scanHelper;
    }


    public void toScan(Context mContext) {
        this.mContext = mContext;
        userDetailInfo = UserInfoUtils.getUserDetailInfo(mContext);
        String driverType = userDetailInfo.getDriverType();
        if (driverType.equals("5")) {
            //邮政
            openScanActivity();
        }
        if (!userDetailInfo.getCertification().equals("1")) {
            //未实名
            showDialog(R.string.alart_un_auth, "#/realNameAuth");
        } else {
            String ifPayDeposit = userDetailInfo.getIfPayDeposit();
//            String packageId = userDetailInfo.getPackageId();
            Integer availableDays = userDetailInfo.getAvailableDays();
            if (driverType.equals("0")) {
                // 骑手 校验 押金和服务费
                if (ifPayDeposit.equals("0")) {
                    //校验押金
                    showDialog(R.string.alart_un_pay, "#/myWallet");
                }
//                else if (TextUtils.isEmpty(packageId)) {
//                    //校验服务费
//                    showDialog(R.string.alart_un_package, "#/myWallet");
//                }
                else if (availableDays == null || availableDays <= 0) {
                    //校验服务费
                    showDialog(R.string.alart_un_package, "#/myWallet");
                } else {
                    checkBattery();
                }
            } else if (driverType.equals("1")) {
                // 押金担保 不校验用户押金，只校验用户服务费
//                if (TextUtils.isEmpty(packageId)) {
//                    //校验服务费
//                    showDialog(R.string.alart_un_package, "#/myWallet");
//                } else
                if (availableDays == null || availableDays <= 0) {
                    //校验服务费
                    showDialog(R.string.alart_un_package, "#/myWallet");
                } else {
                    checkBattery();
                }
            } else if (driverType.equals("2")) {
                // 服务费担保 校验用户押金不校验用户服务费
                if (ifPayDeposit.equals("0")) {
                    //校验押金
                    showDialog(R.string.alart_un_pay, "#/myWallet");
                } else {
                    checkBattery();
                }
            } else {

                checkBattery();
            }

        }
    }

    public void checkBattery() {
        if (userDetailInfo.isHasBattery()) {
            openScanActivity();
        } else {
            //首放
            queryFirstTakeFlag();

        }
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

                QRCodeHelper mQRCodeHelper = QRCodeHelper.getInstance(mContext);
                mQRCodeHelper.qrCodeAnalysis(result,mContext);
                mQRCodeHelper.setQRCodeHelperListener(mQRCodeHelperListener);
            }
        });
        mOpenScanActivityHelper.openScanActivity("扫码换电");
    }

    private void queryFirstTakeFlag() {
        HRetrofitNetHelper retrofitNetHelper = HRetrofitNetHelper.getInstance(mContext);
        ITowerBusiness iCloudBusiness = retrofitNetHelper.getAPIService(ITowerBusiness.class);


        Call<BaseResp<FirstTakeBean>> call = iCloudBusiness.queryFirstTakeFlag(UserInfoUtils.getUserInfo(mContext).getBearerToken(),
                new QueryFirstTakeVo(userDetailInfo.getCityId(), userDetailInfo.getDriverId())
        );

        retrofitNetHelper.enqueueCall(call, new HRetrofitNetHelper.RetrofitCallBack<FirstTakeBean>() {
            @Override
            public void onSuccess(BaseResp<FirstTakeBean> baseResp) {

                FirstTakeBean mBean = baseResp.getResultObject();
                if (mBean != null) {
                    if (mBean.getIfPermitTake().equals("0")) {
                        if (mBean.getFirstTakeFlag().equals("1")) {
                            //弹出 48 60 选择框
                            BatteryVoltsChangeHelper mBatteryVoltsChangeHelper = BatteryVoltsChangeHelper.getInstance(mContext);
                            mBatteryVoltsChangeHelper.setQRCodeHelperListener(mQRCodeHelperListener);
                            mBatteryVoltsChangeHelper.showDialog((Activity) mContext);

                        } else {
                            openScanActivity();
                        }

                    } else {
                        showDialog(R.string.alart_un_enable, "");
                    }
                }
            }

            @Override
            public void onFailure(String error) {

                ToastView.showLong(error);
            }
        });
    }


    private void showDialog(Integer resourseId, String toUrl) {
        RemindDialog dialog = new RemindDialog(mContext);
        dialog.setTitle("温馨提示");
        String content = mContext.getResources().getString(resourseId);
        dialog.setContent(content);
        dialog.setButtonInfoRight("确定", new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
                toWebPage(toUrl);
            }
        });

        dialog.setButtonInfoLeft("取消", new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
            }
        });

        dialog.show();


    }

    public void toWebPage(String pageUrl) {
        Intent mIntent = new Intent(mContext, MainActivity.class);
        mIntent.putExtra(Constant.TRAN_DATA_KEY, pageUrl);

        mContext.startActivity(mIntent);
    }
}
