package com.chinatower.fghd.customer.home;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.widget.TextView;

import com.chinatower.fghd.customer.R;

public class StationListActivity extends AppCompatActivity {



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.station_info_detail_layout);
        initView();

        initDatas();
    }

    private void initDatas() {
//        queryCabinetAndBatteryInfo
    }

    private void initView() {

    }
}