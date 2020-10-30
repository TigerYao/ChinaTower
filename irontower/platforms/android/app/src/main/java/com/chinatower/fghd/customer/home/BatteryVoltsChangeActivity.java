package com.chinatower.fghd.customer.home;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.chinatower.fghd.customer.R;
import com.chinatower.fghd.customer.api.ITowerBusiness;
import com.chinatower.fghd.customer.util.UserInfoUtils;
import com.chinatower.fghd.customer.vo.UserInfo;
import com.chinatower.fghd.customer.vo.home.UpdateUserBatteryVoltsVo;
import com.chinatower.fghd.customer.vo.home.UserDetailInfo;
import com.ztesoft.baselib.base.BaseActivity;
import com.ztesoft.baselib.constant.ExtraName;
import com.ztesoft.baselib.netutils.BaseResp;
import com.ztesoft.baselib.netutils.HRetrofitNetHelper;
import com.ztesoft.baselib.views.ToastView;

import me.devilsen.czxing.code.BarcodeFormat;
import retrofit2.Call;

public class BatteryVoltsChangeActivity extends BaseActivity implements View.OnClickListener {

    /**
     * 48 V
     */
    private TextView mTv48;
    /**
     * 66 V
     */
    private TextView mTv66;
    /**
     * 取消
     */
    private TextView mTvCancel;
    /**
     *
     */
    private RelativeLayout mRlContent;

    ITowerBusiness iCloudBusiness;


    public static void startActivityForResult(Context context) {
        Intent mIntent = new Intent(context, BatteryVoltsChangeActivity.class);
        ((Activity) context).startActivityForResult(mIntent, 1003);

    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_battery_volts_change);
        initView();
    }

    private void initView() {
        mTv48 = (TextView) findViewById(R.id.tv_48);
        mTv48.setOnClickListener(this);
        mTv66 = (TextView) findViewById(R.id.tv_66);
        mTv66.setOnClickListener(this);
        mTvCancel = (TextView) findViewById(R.id.tv_cancel);
        mTvCancel.setOnClickListener(this);
        mRlContent = (RelativeLayout) findViewById(R.id.rl_content);
        mRlContent.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            default:
                break;
            case R.id.tv_48:
                UpdateUserBatteryVoltsVo(48);
//                openScanActivity();
                break;
            case R.id.tv_66:
                UpdateUserBatteryVoltsVo(66);

                break;
            case R.id.tv_cancel:
            case R.id.rl_content:
                setResult(RESULT_CANCELED);
                finish();
                break;
        }
    }


    @Override
    protected void onPause() {
        super.onPause();
//        this.finish();
    }

    public void UpdateUserBatteryVoltsVo(Integer batteryVolts) {
        iCloudBusiness = retrofitNetHelper.getAPIService(ITowerBusiness.class);
        UserInfo mUserInfo = UserInfoUtils.getUserInfo(this);


        showDialog();
        UpdateUserBatteryVoltsVo mUpdateUserBatteryVoltsVo = new UpdateUserBatteryVoltsVo(batteryVolts + "");
        mUpdateUserBatteryVoltsVo.setDriverId(mUserInfo.getDriverId());
        Call<BaseResp<Void>> call = iCloudBusiness.updateUserInfo(mUserInfo.getBearerToken(), mUpdateUserBatteryVoltsVo);

        retrofitNetHelper.enqueueCall(call, new HRetrofitNetHelper.RetrofitCallBack<Void>() {
            @Override
            public void onSuccess(BaseResp<Void> baseResp) {
                cancelDialog();
                UserDetailInfo userDetailInfo = UserInfoUtils.getUserDetailInfo(mContext);
                userDetailInfo.setBatteryVolts(batteryVolts + "");
                UserInfoUtils.setUserDetailInfo(mContext, userDetailInfo);
                openScanActivity();

            }

            @Override
            public void onFailure(String error) {
                cancelDialog();
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

//                QRCodeHelper mQRCodeHelper = QRCodeHelper.getInstance(mContext);
//                mQRCodeHelper.qrCodeAnalysis(result);
//                mQRCodeHelper.setQRCodeHelperListener(mQRCodeHelperListener);


                Intent data = new Intent();
                data.putExtra(ExtraName.KEY_DATA, result);
                setResult(RESULT_OK, data);
                finish();
            }
        });
        mOpenScanActivityHelper.openScanActivity("扫码换电");
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode != RESULT_OK) {
            return;
        }
//        if (requestCode == ScannerActivity.REQUEST_CODE_SCANNER) {
//            setResult(RESULT_OK, data);
//        }
    }
}