package com.ztesoft.baselib.base;

import android.annotation.TargetApi;
import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.LayoutRes;
import android.support.v4.app.FragmentActivity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import com.ztesoft.baselib.R;
import com.ztesoft.baselib.netutils.HRetrofitNetHelper;
import com.ztesoft.baselib.utils.SystemBarTintManager;
import com.ztesoft.baselib.views.dialog.SpotsDialog;



public abstract class KBaseFragmentActivity extends FragmentActivity implements View.OnClickListener {
    public HRetrofitNetHelper retrofitNetHelper;
    public LayoutInflater mInflater;
    public SpotsDialog mDialog;
    public Context mContext;

    public SystemBarTintManager tintManager;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            setTranslucentStatus(true);
            tintManager = new SystemBarTintManager(this);
            tintManager.setStatusBarTintEnabled(true);
            tintManager.setStatusBarTintResource(R.color.theme_color);//通知栏所需颜色
//            布局在状态栏下方
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);

        }
        mContext = this;
    }


    @Override
    public void setContentView(@LayoutRes int layoutResID) {
        super.setContentView(layoutResID);
        mInflater = LayoutInflater.from(this);
        setContentView(mInflater.inflate(layoutResID, null));
    }

    @Override
    public void setContentView(View view) {
        super.setContentView(view);
        retrofitNetHelper = HRetrofitNetHelper.getInstance(KBaseFragmentActivity.this);
        mDialog = new SpotsDialog(KBaseFragmentActivity.this);
    }


    public void bindViewOnclick(int... ids) {
        if (ids != null) {
            View view = null;
            for (int id : ids) {
                view = findViewById(id);
                view.setOnClickListener(this);
            }
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
    protected void onResume() {
        super.onResume();
//        MobclickAgent.onResume(this);

    }

    @Override
    protected void onPause() {
        super.onPause();
//        MobclickAgent.onPause(this);

    }
}

