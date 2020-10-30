package com.chinatower.fghd.customer.home;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.KeyEvent;
import android.view.View;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.chinatower.fghd.customer.R;
import com.chinatower.fghd.customer.util.download.DownloadTool;
import com.chinatower.fghd.customer.vo.home.AppVersion;
import com.ztesoft.baselib.base.BaseActivity;
import com.ztesoft.baselib.constant.ExtraName;

public class UpdateAppActivity extends BaseActivity implements View.OnClickListener {

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

    private AppVersion appVersion;
    private ImageView mIvBack;
    /**
     * 发现新版本
     */
    private TextView mTvTitle;
    private RelativeLayout mRlTop;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.update_app_layout);
        initView();
        initDatas();
    }

    private void initDatas() {
        appVersion = (AppVersion) getIntent().getSerializableExtra(ExtraName.KEY_DATA);

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
                        new DownloadTool(UpdateAppActivity.this, appVersion.getUpgradeUrl(),
                                "铁塔换电", !(appVersion.getIsForceUpgrade() != null && appVersion.getIsForceUpgrade()));
                    } else {
                        //打开浏览器
                        Uri uri = Uri.parse(appVersion.getUpgradeUrl());

                        Intent intent = new Intent(Intent.ACTION_VIEW,uri);

                        startActivity(intent);
                    }
                }


                break;
            case R.id.iv_clolse:
                setResult(RESULT_CANCELED);
                finish();
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