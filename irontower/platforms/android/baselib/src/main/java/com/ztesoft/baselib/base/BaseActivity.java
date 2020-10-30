package com.ztesoft.baselib.base;

import android.annotation.TargetApi;
import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import com.ztesoft.baselib.R;
import com.ztesoft.baselib.constant.BaseConstant;
import com.ztesoft.baselib.netutils.HRetrofitNetHelper;
import com.ztesoft.baselib.utils.StatusBarUtils;
import com.ztesoft.baselib.utils.SystemBarTintManager;
import com.ztesoft.baselib.views.ToastView;
import com.ztesoft.baselib.views.dialog.SpotsDialog;

import java.util.ArrayList;
import java.util.List;


public class BaseActivity extends Activity implements View.OnClickListener {
    public HRetrofitNetHelper retrofitNetHelper;
    public LayoutInflater mInflater;
    public SpotsDialog mDialog;
    public Context mContext;

    public List<BroadcastReceiver> receivers;
    //    AppUpdate appUpdate;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        mContext = this;
        // 使通知栏透明化
        initStatusBar();

        //注册强制退出广播
        putBroadcastReceiver(new ForcedLoginOutReceiver(), BaseConstant.FORCED_LOGIN_OUT_BROADCAST);


    }

    private void initStatusBar() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
            StatusBarUtils.setStatusBarColor(this, R.color.base_lib_white);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
    }


    @Override
    protected void onPause() {
        super.onPause();
        cancelDialog();
    }


    @Override
    public void onClick(View v) {

    }

    public class ForcedLoginOutReceiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
            finish();
            Intent intent1 = new Intent();
            intent1.setClassName("com.chinatower.tthd", "com.chinatower.fghd.customer.MainActivity");
            intent1.putExtra("tran_data_key", "login/");
            intent1.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent1);

        }
    }

    @Override
    public void setContentView(int layoutResID) {
        super.setContentView(layoutResID);
        mInflater = LayoutInflater.from(this);
        setContentView(mInflater.inflate(layoutResID, null));
    }

    @Override
    public void setContentView(View view) {
        super.setContentView(view);
        retrofitNetHelper = HRetrofitNetHelper.getInstance(BaseActivity.this);
        mDialog = new SpotsDialog(BaseActivity.this);
    }

    public void showDialog(String msg) {

        if (mDialog != null && !mDialog.isShowing()) {
            mDialog.setTitle(msg);
            mDialog.show();
        }
    }

    public void showDialog() {

        if (mDialog != null && !mDialog.isShowing()) {
            mDialog.show();
        }
    }

    public void cancelDialog() {

        if (mDialog != null && mDialog.isShowing()) {
            mDialog.cancel();
        }
    }


    public void bindViewOnclick(View... views) {
        if (views != null) {
            for (View view : views) {
                view.setOnClickListener(this);
            }
        }
    }

    @TargetApi(19)
    public void setTranslucentStatus(boolean on) {
        Window win = getWindow();
        WindowManager.LayoutParams winParams = win.getAttributes();
        final int bits = WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS;
        if (on) {
            winParams.flags |= bits;
        } else {
            winParams.flags &= ~bits;
        }
        win.setAttributes(winParams);
    }


    @Override
    protected void onDestroy() {
        super.onDestroy();
//        ButterKnife.
        clearReceiver();

    }


    protected void putBroadcastReceiver(BroadcastReceiver receiver, String action) {
        if (receivers == null) {
            receivers = new ArrayList<BroadcastReceiver>();
        }
        IntentFilter filter = new IntentFilter(action);
        registerReceiver(receiver, filter);
        receivers.add(receiver);
    }

    protected void clearReceiver() {
        if (receivers == null || receivers.size() == 0) {
            return;
        }
        for (int i = 0; i < receivers.size(); i++) {
            unregisterReceiver(receivers.get(i));
        }
        receivers.clear();
    }

}

