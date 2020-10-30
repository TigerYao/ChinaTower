package com.chinatower.fghd.customer.update;

import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.text.TextUtils;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.chinatower.fghd.customer.R;
import com.chinatower.fghd.customer.home.UpdateAppActivity;
import com.chinatower.fghd.customer.util.download.DownloadTool;
import com.chinatower.fghd.customer.vo.home.AppVersion;
import com.ztesoft.baselib.constant.ExtraName;

/**
 * @auther EnzoChan
 * created:2020/10/21
 * desc:
 */
public class UpdateDialog extends Dialog implements View.OnClickListener {


    private Context mContext;
    private AppVersion appVersion;


    /**
     * v.1.0.0(build 121)
     */
    private TextView mTvVersion;
    /**
     * 1.多种登录方式，简单方便；\n2.页面优化成卡片式更加美观；\n3.在一个app切换不同的店铺操作
     */
    private TextView mTvUpdateContent;
    /**
     * 立即升级
     */
    private TextView mBtnUpdate;
    private ImageView mIvClolse;

    private ImageView mIvBack;
    /**
     * 发现新版本
     */
    private TextView mTvTitle;
    private RelativeLayout mRlTop;


    public UpdateDialog(@NonNull Context context) {
        super(context);
        this.mContext = context;
    }

    public void setAppVersion(AppVersion appVersion) {
        this.appVersion = appVersion;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setFlags(
                WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        //设置一个布局
        setContentView(R.layout.update_app_layout);
//        getWindow().addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
//        //注意要清除 FLAG_TRANSLUCENT_STATUS flag
//        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
////        //设置window背景，默认的背景会有Padding值，不能全屏。当然不一定要是透明，你可以设置其他背景，替换默认的背景即可。
        getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
////        //一定要在setContentView之后调用，否则无效
        getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);

        initView();
        initDatas();
    }

    private void initDatas() {

        if (appVersion != null) {
            mTvUpdateContent.setText(appVersion.getUpgradeDescribe());
            mTvVersion.setText(appVersion.getAppVersion());
            if (appVersion.getIsForceUpgrade() != null && appVersion.getIsForceUpgrade()) {
                mIvClolse.setVisibility(View.GONE);
            }
        }
    }

    private void initView() {
        mTvVersion = (TextView) findViewById(R.id.tv_version);
        mTvUpdateContent = (TextView) findViewById(R.id.tv_update_content);
        mBtnUpdate = (TextView) findViewById(R.id.btn_update);
        mIvClolse = (ImageView) findViewById(R.id.iv_clolse);
        mIvBack = (ImageView) findViewById(R.id.iv_back);
        mTvTitle = (TextView) findViewById(R.id.tv_title);
        mBtnUpdate.setOnClickListener(this);
        mRlTop = (RelativeLayout) findViewById(R.id.rl_top);
        mIvClolse.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            default:
                break;
            case R.id.btn_update:

                if (appVersion != null && !TextUtils.isEmpty(appVersion.getUpgradeUrl())) {
                    if (appVersion.getUpgradeUrl().endsWith(".apk")) {
                        //下载app
                        new DownloadTool(mContext, appVersion.getUpgradeUrl(),
                                "铁塔换电", !(appVersion.getIsForceUpgrade() != null && appVersion.getIsForceUpgrade()));
                    } else {
                        //打开浏览器
                        Uri uri = Uri.parse(appVersion.getUpgradeUrl());

                        Intent intent = new Intent(Intent.ACTION_VIEW, uri);

                        mContext.startActivity(intent);
                    }
                }


                break;
            case R.id.iv_clolse:
                cancel();
                break;
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            return true;
        }
        return false;
    }

}
