package com.ztesoft.baselib.base;

import android.content.BroadcastReceiver;
import android.content.IntentFilter;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.RequiresApi;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.view.View;

import com.ztesoft.baselib.netutils.HRetrofitNetHelper;

import java.util.ArrayList;
import java.util.List;


/**
 * fragment 基类
 *
 * @author huhui
 * @version 1.0
 * @time 2016/5/23 14:24
 */
public class BaseFragment extends Fragment implements View.OnClickListener {
    protected FragmentActivity mContext;
    protected String mTitle;
    protected int mTitleBgResId;


    public HRetrofitNetHelper retrofitNetHelper;

    public List<BroadcastReceiver> receivers;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mContext = (FragmentActivity) getActivity();
        retrofitNetHelper = HRetrofitNetHelper.getInstance(mContext);

    }


    @Override
    public void onResume() {
        super.onResume();
//        MobclickAgent.onResume(getActivity());

    }

    @Override
    public void onPause() {
        super.onPause();
//        MobclickAgent.onPause(getActivity());

    }

    public String getTitle() {
        return mTitle;
    }

    public void setTitle(String mTitle) {
        this.mTitle = mTitle;
    }

    public int getTitleResource() {
        return mTitleBgResId;
    }

    public void setTitleBgResId(int mTitleBgResId) {
        this.mTitleBgResId = mTitleBgResId;
    }


    @Override
    public void onClick(View v) {

    }

    public void bindViewOnclick(View rootView, int... ids) {
        if (ids != null) {
            View view = null;
            for (int id : ids) {
                view = rootView.findViewById(id);
                view.setOnClickListener(this);
            }
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    protected void putBroadcastReceiver(BroadcastReceiver receiver, String action) {
        if (receivers == null) {
            receivers = new ArrayList<BroadcastReceiver>();
        }
        IntentFilter filter = new IntentFilter(action);
        getContext().registerReceiver(receiver, filter);
        receivers.add(receiver);
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    protected void clearReceiver() {
        if (receivers == null || receivers.size() == 0) {
            return;
        }
        for (int i = 0; i < receivers.size(); i++) {
            getContext().unregisterReceiver(receivers.get(i));
        }
        receivers.clear();
    }
}
