package com.ztesoft.baselib.views;

import android.content.Context;
import android.support.v4.widget.SwipeRefreshLayout;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.ViewConfiguration;


/**
 * 项目：adorn_android on 七月
 * 作者：${ChenZhiYu} on 2016/7/22 0022 00:54
 * 邮箱：469142634@qq.com
 */

public class CustomSwipeToRefresh extends SwipeRefreshLayout {
  private int mTouchSlop;
  private float mPrevX;

  public CustomSwipeToRefresh(Context context, AttributeSet attrs) {
    super(context, attrs);

    mTouchSlop = ViewConfiguration.get(context).getScaledTouchSlop();
  }

  @Override
  public boolean onInterceptTouchEvent(MotionEvent event) {

    switch (event.getAction()) {
      case MotionEvent.ACTION_DOWN:
        mPrevX = MotionEvent.obtain(event).getX();
        break;

      case MotionEvent.ACTION_MOVE:
        final float eventX = event.getX();
        float xDiff = Math.abs(eventX - mPrevX);

        if (xDiff > mTouchSlop) {
          return false;
        }
    }

    return super.onInterceptTouchEvent(event);
  }
}
