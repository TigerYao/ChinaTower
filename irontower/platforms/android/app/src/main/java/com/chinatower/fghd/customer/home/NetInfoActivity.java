package com.chinatower.fghd.customer.home;

import android.os.Bundle;
import android.view.View;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.chinatower.fghd.customer.R;
import com.chinatower.fghd.customer.vo.home.ServiceDetailInfo;
import com.ztesoft.baselib.base.BaseActivity;
import com.ztesoft.baselib.constant.ExtraName;

public class NetInfoActivity extends BaseActivity implements View.OnClickListener {

    /**
     * 恩济西里小区南口服务网点
     */
    private TextView mTvName;
    /**
     * 北京市海淀区恩济西街8号
     */
    private TextView mTvLocation;
    /**
     * 详情
     */
    private TextView mTvDetail;
    private RelativeLayout mRlItem;

    private ServiceDetailInfo stationInfo;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_net_info);
        initView();
        initDatas();
    }

    private void initDatas() {
        stationInfo = (ServiceDetailInfo) getIntent().getSerializableExtra(ExtraName.KEY_DATA);

        if (stationInfo != null) {
            mTvName.setText(stationInfo.getNodeName());
            mTvLocation.setText(stationInfo.getNodeAddress());
        }
    }

    private void initView() {
        mTvName = (TextView) findViewById(R.id.tv_name);
        mTvLocation = (TextView) findViewById(R.id.tv_location);
        mTvDetail = (TextView) findViewById(R.id.tv_detail);
        mTvDetail.setOnClickListener(this);
        mRlItem = (RelativeLayout) findViewById(R.id.rl_item);
        mRlItem.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            default:
                break;
            case R.id.tv_detail:
                break;
            case R.id.rl_item:
                setResult(RESULT_CANCELED);
                finish();
                break;
        }
    }
}