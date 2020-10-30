package com.ztesoft.baselib.views.ads;


import android.app.Activity;
import android.content.Context;
import android.support.v4.view.PagerAdapter;
import android.support.v4.view.ViewPager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.ImageView;


import com.ztesoft.baselib.R;

import java.util.ArrayList;
import java.util.List;


/**
 * 广告适配器
 *
 * @author: huhui
 * @time: 2016/5/21 11:38
 */
public class AdPagerAdapter extends PagerAdapter {
    private static final String TAG = "AdPicturePagerAdapter";
    protected Context mContext;
    private boolean isCirculation = false;
    private CustomViewPager mViewPager;
    private ViewPageNumWrapper mPageNumWrapper;
    private int circulationIndex = 0;
    private boolean isScrolling = false; // 滚动框是否滚动着
    private List<ResAdsParItem> mAdpageInfos = new ArrayList<ResAdsParItem>();

    public AdPagerAdapter(Context context) {
        super();
        mContext = context;
    }

    public void clearItem() {
        if (mAdpageInfos.size() != 0) {
            mAdpageInfos.clear();
        }
    }

    public void notifyAdPages(List<ResAdsParItem> adpageInfos) {
        mAdpageInfos.clear();
        mPageNumWrapper.setTotalPages(adpageInfos.size());
        if (mAdpageInfos.size() <= 1) {
            isCirculation = false;
        }
        if (isCirculation) {
            mAdpageInfos.add(adpageInfos.get(adpageInfos.size() - 1));
            mAdpageInfos.addAll(adpageInfos);
            mAdpageInfos.add(adpageInfos.get(0));
        } else {
            mAdpageInfos.addAll(adpageInfos);
        }
        notifyDataSetChanged();

        if (isCirculation) {
            setCirculationCurrentItem(1);
        } else if (!mAdpageInfos.isEmpty()) {
            setSimpleCurrentItem(0);
        }

        mViewPager.setOffscreenPageLimit(mAdpageInfos.size() / 2 + 1);
    }


    @Override
    public int getCount() {
        int pageCount = 0;
        pageCount = mAdpageInfos.size();
        return pageCount;
    }

    @Override
    public View instantiateItem(ViewGroup container, int position) {
        final Context context = container.getContext();
        LayoutInflater inflater = LayoutInflater.from(context);
        final ResAdsParItem page = mAdpageInfos.get(position);
        View imageLayout = inflater.inflate(R.layout.pager_image_item, container, false);
        assert imageLayout != null;

        ImageView imageView = (ImageView) imageLayout.findViewById(R.id.sample_image1);
//        BitmapHelp.display(imageView, page.originalUrl);

        container.addView(imageLayout, ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);

        imageView.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                ((Activity) mContext).finish();
            }
        });

        return imageLayout;
    }


    @Override
    public void destroyItem(ViewGroup container, int position, Object object) {
        container.removeView((View) object);
    }

    @Override
    public boolean isViewFromObject(View view, Object object) {
        return view == object;
    }


    public void initCirculationBanner(CustomViewPager viewPager, ViewPageNumWrapper pageNumWrapper) {
        setCirculation(true);
        mViewPager = viewPager;
        mPageNumWrapper = pageNumWrapper;
        mViewPager.setAdapter(this);
        mViewPager.setOnPageChangeListener(new CirculationPageChangeListener());

    }

    public void setCirculation(boolean flag) {
        isCirculation = flag;
    }

    public void setCirculationCurrentItem(int position) {
        circulationIndex = position;
        int max = getCount() - 1;
        if (position == 0) {
            circulationIndex = max - 1;
            mViewPager.setCurrentItem(circulationIndex, false);
        } else if (position == max) {
            circulationIndex = 1;
            mViewPager.setCurrentItem(circulationIndex, false);
        } else {
            mViewPager.setCurrentItem(circulationIndex, true);
        }
        mPageNumWrapper.setCurrentPageIndex(circulationIndex - 1);
    }

    public void setSimpleCurrentItem(int position) {
        mViewPager.setCurrentItem(position);
        mPageNumWrapper.setCurrentPageIndex(position);
    }

    public void setCurrentItem(int position) {
        if (isCirculation) {
            setCirculationCurrentItem(position);
        } else {
            setSimpleCurrentItem(position);
        }
    }

    public void loopToNext() {
        if (!isScrolling && getCount() > 1) {
            int max = getCount() + 1;
            int position = (circulationIndex + 1) % getCount();
            mViewPager.setCurrentItem(position, true);
            if (position == max) { // 最后一页时回到第一页
                mViewPager.setCurrentItem(1, false);
            }
        }

    }

    private class CirculationPageChangeListener implements ViewPager.OnPageChangeListener {

        @Override
        public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {

        }

        @Override
        public void onPageSelected(int position) {
            int max = getCount() - 1;
            int pageNumWrapperIndex = position;
            circulationIndex = position;
            if (isCirculation) {
                if (position == 0) {
                    circulationIndex = max - 1;
                } else if (position == max) {
                    circulationIndex = 1;
                }
                pageNumWrapperIndex = circulationIndex - 1;
            }
            mPageNumWrapper.setCurrentPageIndex(pageNumWrapperIndex);
        }

        @Override
        public void onPageScrollStateChanged(int state) {
            if (state == ViewPager.SCROLL_STATE_DRAGGING) {
                isScrolling = true;
                return;
            }
            if (state == ViewPager.SCROLL_STATE_IDLE) {
                mViewPager.setCurrentItem(circulationIndex, false);
            }

            isScrolling = false;
        }


    }
}
