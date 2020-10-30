package com.chinatower.tthd.wxapi;


import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import org.apache.cordova.h5Bridge.H5bridge;

public class WXPayEntryActivity extends Activity implements IWXAPIEventHandler {


    private IWXAPI api;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        api = WXAPIFactory.createWXAPI(this, "wxe6b4508da29eeb85");
        api.handleIntent(getIntent(), this);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        api.handleIntent(intent, this);
    }

    @Override
    public void onReq(BaseReq req) {
    }

    @Override
    public void onResp(BaseResp resp) {

        if (resp.getType() == ConstantsAPI.COMMAND_PAY_BY_WX) {

            String result = null;
            if (resp.errCode == 0) {
            } else if (resp.errCode == -1) {
                result = "支付失败";
            } else {
                result = "用户取消";
            }
            Intent mIntent = new Intent();

            mIntent.setAction(H5bridge.WX_ACTION);
            mIntent.putExtra("resultCode", resp.errCode);
            mIntent.putExtra("errorStr", result);
            sendBroadcast(mIntent);
//            Toast.makeText(this, result, Toast.LENGTH_LONG).show();
            finish();
        }
    }
}