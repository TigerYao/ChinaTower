package com.chinatower.fghd.customer.home;

import android.content.Context;
import android.content.Intent;
import android.support.constraint.ConstraintLayout;
import android.support.v4.view.ViewCompat;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.chinatower.fghd.customer.Constant.Constant;
import com.chinatower.fghd.customer.MainActivity;
import com.chinatower.fghd.customer.R;
import com.chinatower.fghd.customer.home.adapter.StationListAdapter;
import com.chinatower.fghd.customer.vo.StationListInfo;
import com.chinatower.fghd.customer.vo.home.ServiceDetailInfo;
import com.chinatower.fghd.customer.vo.home.StationInfo;
import com.google.gson.Gson;
import com.ztesoft.baselib.utils.DisplayUtil;

import java.util.List;

/**
 * @auther EnzoChan
 * created:2020/9/7
 * desc:
 */
public class NetInfoPopuHelper {


    public static void showNetInfo(ServiceDetailInfo serviceDetailInfo, Context mContext, RelativeLayout view) {
        View popupWindow = LayoutInflater.from(mContext).inflate(R.layout.activity_net_info, null);

        popupWindow.findViewById(R.id.tv_detail).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent mIntent = new Intent(mContext, MainActivity.class);
                String pageUrl = "#/serviceNetworkDetail?nodeId=" + serviceDetailInfo.getNodeId() + "&item=" + new Gson().toJson(serviceDetailInfo) + "&type=serviceNetwork&native=1";
                mIntent.putExtra(Constant.TRAN_DATA_KEY, pageUrl);

                mContext.startActivity(mIntent);

            }
        });

        ((TextView) popupWindow.findViewById(R.id.tv_name)).setText(serviceDetailInfo.getNodeName());
        ((TextView) popupWindow.findViewById(R.id.tv_location)).setText(serviceDetailInfo.getNodeName());

        view.addView(popupWindow);
    }

    public static void showStationInfo(String greyFlag, List<StationListInfo> resultObject, Context mContext, RelativeLayout mRlAddViews, Integer currentQueryType) {
        View popupWindow = LayoutInflater.from(mContext).inflate(R.layout.station_info_layout, null);

        RecyclerView mRyStation = popupWindow.findViewById(R.id.ry_station);
        mRyStation.setHasFixedSize(false);

        StationListAdapter mAdapter = new StationListAdapter(mContext);
        mRyStation.setAdapter(mAdapter);
        mAdapter.setGreyFlag(greyFlag);
        mAdapter.setCurrentQueryType(currentQueryType);
        mAdapter.setItems(resultObject);

        mRyStation.setLayoutManager(new LinearLayoutManager(mContext));

        mRyStation.post(new Runnable() { //将修改高度的代码放到RecyclerView最后面执行，让RecyclerView先测量完毕
            @Override
            public void run() {
                if (mRyStation.getAdapter() == null || mRyStation.getAdapter().getItemCount() <= 2) { //小于4个不固定高度
                    return;
                }
                View view = mRyStation.getChildAt(0);
                if (view == null) {
                    return;
                }
                int height = view.getHeight() * 2;
                ViewGroup.LayoutParams layoutParams = mRyStation.getLayoutParams();
                layoutParams.height = height;
                mRyStation.setLayoutParams(layoutParams);
            }
        });


        mRlAddViews.addView(popupWindow);
    }


}
