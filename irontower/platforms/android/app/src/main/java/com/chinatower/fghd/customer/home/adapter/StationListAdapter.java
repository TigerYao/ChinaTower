package com.chinatower.fghd.customer.home.adapter;

import android.content.Context;
import android.content.Intent;
import android.graphics.Point;
import android.support.v7.widget.RecyclerView;
import android.text.Spannable;
import android.text.SpannableStringBuilder;
import android.text.style.ForegroundColorSpan;
import android.view.Display;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.TextView;

import com.chinatower.fghd.customer.Constant.Constant;
import com.chinatower.fghd.customer.MainActivity;
import com.chinatower.fghd.customer.R;
import com.chinatower.fghd.customer.vo.StationListInfo;
import com.google.gson.Gson;
import com.ztesoft.baselib.base.KBaseRecyclerAdapter;

/**
 * @auther EnzoChan
 * created:2020/8/24
 * desc:
 */
public class StationListAdapter extends KBaseRecyclerAdapter<StationListInfo> {


    /**
     * greyFlag (string, optional): 站点是否在置灰  0不置灰 1置灰
     */
    private String greyFlag;
    private Integer currentQueryType;

    public void setGreyFlag(String greyFlag) {
        this.greyFlag = greyFlag;
    }


    public void setCurrentQueryType(Integer currentQueryType) {
        this.currentQueryType = currentQueryType;
    }

    public StationListAdapter(Context context) {
        super(context);
    }

    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.station_info_detail_layout, parent, false);
        ViewHolder holder = new ViewHolder(view);

        return holder;

    }

    @Override
    public void onBindViewHolder(RecyclerView.ViewHolder holder, int position) {
        if (holder instanceof ViewHolder) {
            ((ViewHolder) holder).bindData(position);
        }
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        /**
         * 1
         */
        private TextView mTvFullCount;
        /**
         * 福州市上街源通路新大洲店
         */
        private TextView mTvCabinetName;
        /**
         * 闽侯上街国宾大道源通路口18号
         */
        private TextView mTvCabinetAddress;
        /**
         * 满电的0块
         */
        private TextView mTvCount60;
        /**
         * 充电中0块
         */
        private TextView mTvCount60Loading;
        /**
         * 满电的0块
         */
        private TextView mTvCount48;
        /**
         * 充电中0块
         */
        private TextView mTvCount48Loading;
        /**
         * 详情
         */
        private TextView mTvDetail;
        private TextView mTvQueryType;


        private ImageView mIvLine;

        public ViewHolder(View itemView) {
            super(itemView);
            mTvFullCount = (TextView) itemView.findViewById(R.id.tv_full_count);
            mTvCabinetName = (TextView) itemView.findViewById(R.id.tv_cabinet_name);
            mTvCabinetAddress = (TextView) itemView.findViewById(R.id.tv_cabinet_address);
            mTvCount60 = (TextView) itemView.findViewById(R.id.tv_count_60);
            mTvCount60Loading = (TextView) itemView.findViewById(R.id.tv_count_60_loading);
            mTvCount48 = (TextView) itemView.findViewById(R.id.tv_count_48);
            mTvCount48Loading = (TextView) itemView.findViewById(R.id.tv_count_48_loading);
            mTvDetail = (TextView) itemView.findViewById(R.id.tv_detail);
            mTvQueryType = (TextView) itemView.findViewById(R.id.tv_query_type);
            mIvLine = itemView.findViewById(R.id.iv_line);
        }

        public void bindData(int position) {
            StationListInfo info = itemList.get(position);


            if (greyFlag.equals("1")) {
                mTvDetail.setBackground(context.getResources().getDrawable(R.drawable.home_net_station_detail_btn_back_gray));
            } else {
                mTvDetail.setBackground(context.getResources().getDrawable(R.drawable.home_net_station_detail_btn_back));
            }


            if (currentQueryType != 0) {
                mTvQueryType.setText("剩余空库");
                mTvFullCount.setText(Integer.parseInt(info.getCabinCount()) - Integer.parseInt(info.getFullCount()) - Integer.parseInt(info.getNotFullCount())+"");
            } else {
                mTvFullCount.setText(info.getFullCount());

            }

            mTvCabinetAddress.setText(info.getCabinetAddress());

            mTvCabinetName.setText(info.getCabinetName());

            mTvCount48.setText(info.getFullCount48());

            mTvCount60.setText(info.getFullCount60());


//            String notFullCount = "充电中" + info.getNotFullCount48() + "块";
//            SpannableStringBuilder styleNoFull48 = new SpannableStringBuilder(notFullCount);
//            int indexNoFull48= notFullCount.indexOf("块");
//            styleNoFull48.setSpan(new ForegroundColorSpan(context.getResources().getColor(R.color.power_down_20)), 3, indexNoFull48, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
            mTvCount48Loading.setText(info.getNotFullCount48());
//            mTvCount48Loading.setText(notFullCount);


//            String notFullCount60 = "充电中" + info.getNotFullCount60() + "块";
//            SpannableStringBuilder styleNoFull60 = new SpannableStringBuilder(notFullCount60);
//            int indexNoFull60 = notFullCount60.indexOf("块");
//            styleNoFull60.setSpan(new ForegroundColorSpan(context.getResources().getColor(R.color.power_down_20)), 3, indexNoFull60, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
            mTvCount60Loading.setText(info.getNotFullCount60());
//            mTvCount48Loading.setText(notFullCount60);

            mTvDetail.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    String pageUrl = "#/eleCabinetDetail?cabinetId=" + info.getCabinetId() + "&item=" + new Gson().toJson(info) + "&type=batteryStation&native=1";

                    toWebPage(pageUrl);
                }
            });
            if (position == itemList.size() - 1) {
                mIvLine.setVisibility(View.GONE);
            } else {
                mIvLine.setVisibility(View.VISIBLE);

            }
        }


        public void toWebPage(String pageUrl) {
            Intent mIntent = new Intent(context, MainActivity.class);
            mIntent.putExtra(Constant.TRAN_DATA_KEY, pageUrl);

            context.startActivity(mIntent);
        }
    }
}
