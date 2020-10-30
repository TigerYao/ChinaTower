package com.ztesoft.baselib.views.ads;

import android.content.Context;
import android.content.res.TypedArray;
import android.os.Handler;
import android.os.Message;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;

import com.ztesoft.baselib.R;
import com.ztesoft.baselib.utils.ListUtils;

import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

/***
 * 广告控件，使用说明，布局中引入，在activity中，findviewbyid,即可， 然后调用updateAds方法，设置数据
 * <p/>
 * 在RecyclerView中用法，参考 RankPageRecyclerViewAdapter类
 * <p/>
 * Created by huhui
 */
public class AdsView extends RelativeLayout {

    private static final int MSG_BANNER = 1;
    //     广告滑动时间
    private final long adsTime = 6 * 1000;
    /***
     * 类型
     */
    public int adsType = 1;
    public Timer bannerTimer;
    private Context context;
    private CustomViewPager mViewPager;
    private ViewPageNumWrapper mPageNumWrapper;
    private ViewGroup pageNumView;
    /*循环专区*/
    private MyTimerHandler mHandler = new MyTimerHandler();
    private AdPagerAdapter mPictureAdapter;

    public AdsView(Context context) {
        this(context, null);
        this.context = context;
    }

    public AdsView(final Context context, AttributeSet attrs) {
        super(context, attrs);
        this.context = context;
        LayoutInflater.from(context).inflate(R.layout.layout_ads, this, true);
        TypedArray a = context.obtainStyledAttributes(attrs,
                R.styleable.adsView);
        final int N = a.getIndexCount();
        for (int i = 0; i < N; i++) {
            int attr = a.getIndex(i);

        }
        this.setVisibility(View.VISIBLE);
    }

    @Override
    protected void onFinishInflate() {
        // TODO Auto-generated method stub
        super.onFinishInflate();
        initView();
    }

    private void initView() {
        mViewPager = (CustomViewPager) findViewById(R.id.header_viewpager);
        pageNumView = (ViewGroup) findViewById(R.id.page_num);
        mPictureAdapter = new AdPagerAdapter(context);

//        int screenWidth = context.getResources().getDisplayMetrics().widthPixels;
//        float width = (screenWidth - 2 * 5);
//        int height = (int) (width / 2.5);
        mPageNumWrapper = new ViewPageNumWrapper(context, pageNumView);
        mViewPager.setLayoutParams(new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

    }

    private void closeTimer(Timer timer) {
        if (timer != null) {
            timer.cancel();
            timer = null;
        }
    }


    private void updataBanner() {
        closeTimer(bannerTimer);
        bannerTimer = new Timer();
        bannerTimer.schedule(new TimerTask() {

            @Override
            public void run() {
                mHandler.sendEmptyMessage(MSG_BANNER);
            }
        }, adsTime, adsTime);
    }


    /***
     * 更新广告
     *
     * @param pages
     */
    public void updateAds(List<ResAdsParItem> pages) {
        if (!ListUtils.isEmpty(pages)) {
            mPictureAdapter.initCirculationBanner(mViewPager, mPageNumWrapper);
            mPictureAdapter.clearItem();
            mPictureAdapter.notifyAdPages(pages);
            updataBanner();
        }
    }


    private class MyTimerHandler extends Handler {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            switch (msg.what) {
                case MSG_BANNER:
                    mPictureAdapter.loopToNext();
                    break;
            }

        }


    }


    public CustomViewPager getViewPager() {
        return mViewPager;
    }


}