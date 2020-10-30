package com.chinatower.fghd.customer.home;

import android.app.Activity;
import android.content.Context;

import com.chinatower.fghd.customer.api.ITowerBusiness;
import com.chinatower.fghd.customer.util.UserInfoUtils;
import com.chinatower.fghd.customer.views.popupmenu.NIMPopupMenu;
import com.chinatower.fghd.customer.views.popupmenu.PopupMenuItem;
import com.chinatower.fghd.customer.vo.UserInfo;
import com.chinatower.fghd.customer.vo.home.UpdateUserBatteryVoltsVo;
import com.chinatower.fghd.customer.vo.home.UserDetailInfo;
import com.ztesoft.baselib.netutils.BaseResp;
import com.ztesoft.baselib.netutils.HRetrofitNetHelper;
import com.ztesoft.baselib.views.ToastView;

import java.util.ArrayList;
import java.util.List;

import me.devilsen.czxing.code.BarcodeFormat;
import retrofit2.Call;

/**
 * @auther EnzoChan
 * created:2020/10/15
 * desc:
 */
public class BatteryVoltsChangeHelper {

    private static BatteryVoltsChangeHelper mBatteryVoltsChangeHelper;

    private Context mContext;

    private QRCodeHelper.QRCodeHelperListener mQRCodeHelperListener;


    public void setQRCodeHelperListener(QRCodeHelper.QRCodeHelperListener mQRCodeHelperListener) {
        this.mQRCodeHelperListener = mQRCodeHelperListener;
    }

    public BatteryVoltsChangeHelper(Context mContext) {
        this.mContext = mContext;
    }

    public static BatteryVoltsChangeHelper getInstance(Context mContext) {

        if (mBatteryVoltsChangeHelper == null) {
            mBatteryVoltsChangeHelper = new BatteryVoltsChangeHelper(mContext);
        }

        return mBatteryVoltsChangeHelper;

    }


    public void showDialog(Activity mActivity) {
        List<PopupMenuItem> list = new ArrayList<>();
        list.add(new PopupMenuItem("48V", "48V"));
        list.add(new PopupMenuItem("60V", "60V"));
        NIMPopupMenu popupMenu = new NIMPopupMenu(mActivity, list, new NIMPopupMenu.MenuItemClickListener() {
            @Override
            public void onItemClick(PopupMenuItem item) {
                if (item.getTitle().contains("48V")) {
                    UpdateUserBatteryVoltsVo(48);

                } else if (item.getTitle().contains("60V")) {

                    UpdateUserBatteryVoltsVo(60);
                }

            }

        }, NIMPopupMenu.TYPE_BG_BLACK, false);

        popupMenu.notifyData();

        popupMenu.showInParentCenter(mActivity);


    }

    public void UpdateUserBatteryVoltsVo(Integer batteryVolts) {
        ITowerBusiness iCloudBusiness = HRetrofitNetHelper.getInstance(mContext).getAPIService(ITowerBusiness.class);
        UserInfo mUserInfo = UserInfoUtils.getUserInfo(mContext);
//        showDialog();
        UpdateUserBatteryVoltsVo mUpdateUserBatteryVoltsVo = new UpdateUserBatteryVoltsVo(batteryVolts + "");
        mUpdateUserBatteryVoltsVo.setDriverId(mUserInfo.getDriverId());
        Call<BaseResp<Void>> call = iCloudBusiness.updateUserInfo(mUserInfo.getBearerToken(), mUpdateUserBatteryVoltsVo);

        HRetrofitNetHelper.getInstance(mContext).enqueueCall(call, new HRetrofitNetHelper.RetrofitCallBack<Void>() {
            @Override
            public void onSuccess(BaseResp<Void> baseResp) {
//                cancelDialog();
                UserDetailInfo userDetailInfo = UserInfoUtils.getUserDetailInfo(mContext);
                userDetailInfo.setBatteryVolts(batteryVolts + "");
                UserInfoUtils.setUserDetailInfo(mContext, userDetailInfo);
                openScanActivity();

            }

            @Override
            public void onFailure(String error) {
//                cancelDialog();
                ToastView.showLong(error);
            }
        });
    }

    private void openScanActivity() {
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
}
