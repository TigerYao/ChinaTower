package com.ztesoft.baselib.views.ads;

import android.content.Context;
import android.support.v4.view.ViewPager;
import android.view.LayoutInflater;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;

import com.ztesoft.baselib.R;

import java.util.ArrayList;
import java.util.List;



/**
 * 提供ViewPage 滚动时，页码"..."随之滚动的功能
 *
 * @author yinfeng
 */
public class ViewPageNumWrapper implements ViewPager.OnPageChangeListener {
    private Context mContext;
    private ViewGroup mViewGroup;
    private List<ImageView> mImageViews = new ArrayList<ImageView>();
    // 当前页的索引号
    private int mCurrentPageIndex;
    private int mImageDark;
    private int mImageLight;

    private CustomViewPager mViewPager;

    public ViewPageNumWrapper(Context context) {
        super();
        // TODO Auto-generated constructor stub

        mContext = context;

        LayoutInflater inflater = LayoutInflater.from(context);
        mViewGroup = (ViewGroup) inflater.inflate(R.layout.page_num, null);
        removeAllPageNumber();
        setNumberImageResource(R.drawable.banner_point_over, R.drawable.banner_point_nor);
    }

    public ViewPageNumWrapper(Context context, ViewGroup viewGroup) {
        super();
        // TODO Auto-generated constructor stub

        mContext = context;
        mViewGroup = viewGroup;
        removeAllPageNumber();
        setNumberImageResource(R.drawable.banner_point_over, R.drawable.banner_point_nor);
    }

    public ViewGroup getViewGroup() {
        return mViewGroup;
    }


    /**
     * 设置页码的资源
     *
     * @param light 代表当前页
     * @param dark  非当前页
     */
    public void setNumberImageResource(int light, int dark) {
        mImageLight = light;
        mImageDark = dark;
    }

    /**
     * 设置总共的页数
     *
     * @param num
     */
    public void setTotalPages(int num) {
        removeAllPageNumber();
        for (int i = 0; i < num; i++) {
            addPageNumber();
        }
    }

    /**
     * 设置当前滚动到的页码
     *
     * @param index 从0开始
     */
    public boolean setCurrentPageIndex(int index) {
        if (index < 0 || index >= mImageViews.size()) {
            return false;
        }

        if (mCurrentPageIndex >= 0 && mCurrentPageIndex < mImageViews.size()) {
            mImageViews.get(mCurrentPageIndex).setImageResource(mImageDark);
        }

        mImageViews.get(index).setImageResource(mImageLight);
        mCurrentPageIndex = index;

        return true;
    }

    /**
     * 添加一个图，代表一页
     */
    protected void addPageNumber() {
        ImageView imageView = new ImageView(mContext);
        imageView.setImageResource(mImageDark);

        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        int right = (int) mContext.getResources().getDimension(R.dimen.page_num_margins_right);
        int left = (int) mContext.getResources().getDimension(R.dimen.page_num_margins_left);
        params.setMargins(left, 0, right, 0);
        imageView.setLayoutParams(params);

        mViewGroup.addView(imageView);
        mImageViews.add(imageView);
    }


    /**
     * 删除所有的页码
     */
    protected void removeAllPageNumber() {
        mViewGroup.removeAllViews();
        mImageViews.clear();
        mCurrentPageIndex = -1;
    }


    public void upDataPageNum() {
        setTotalPages(mViewPager.getAdapter().getCount());
    }

    @Override
    public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {

    }

    @Override
    public void onPageSelected(int position) {
        setCurrentPageIndex(position);
    }

    @Override
    public void onPageScrollStateChanged(int state) {


    }
}
