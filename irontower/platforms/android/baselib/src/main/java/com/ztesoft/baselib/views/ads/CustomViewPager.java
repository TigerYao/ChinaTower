package com.ztesoft.baselib.views.ads;


import android.content.Context;
import android.support.v4.view.ViewPager;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.View;


/**
 * 对 ViewPager 进行定制
 * @author yinfeng
 *
 */
public class CustomViewPager extends ViewPager {
	private ScaleType mScaleType = ScaleType.NORMAL;

	public CustomViewPager(Context context) {
		super(context);
	}

	public CustomViewPager(Context context, AttributeSet attrs) {
		super(context, attrs);
	}

	/**
	 * 重载该方法的原因见下
	 * Hacky fix for Issue #4 and
	 * http://code.google.com/p/android/issues/detail?id=18990
	 * 
	 * ScaleGestureDetector seems to mess up the touch events, which means that
	 * ViewGroups which make use of onInterceptTouchEvent throw a lot of
	 * IllegalArgumentException: pointerIndex out of range.
	 * 
	 * There's not much I can do in my code for now, but we can mask the result by
	 * just catching the problem and ignoring it.
	 * 
	 * @author Chris Banes
	 */
	@Override
	public boolean onInterceptTouchEvent(MotionEvent ev) {
		try {
			return super.onInterceptTouchEvent(ev);
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
			return false;
		}
	}
	
	public void setScaleType(ScaleType type){
		mScaleType = type;
	}

	@Override
	protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
		if(mScaleType == ScaleType.NORMAL){
			super.onMeasure(widthMeasureSpec, heightMeasureSpec);
			return;
		}
		
		int height = 0;
		for (int i = 0; i < getChildCount(); i++) {
			View child = getChildAt(i);
			child.measure(widthMeasureSpec,
					MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED));
			int h = child.getMeasuredHeight();
			int w = child.getMeasuredWidth();
			if(mScaleType == ScaleType.MIN_HEIGHT) {
				if(height == 0){
					height = h;
				}else if(h > 0 && h < height){
					height = h;
				}	
			}else if(mScaleType == ScaleType.MAX_HEIGHT){
				if(h > height){
					height = h;
				}
			}
			
		}

		heightMeasureSpec = MeasureSpec.makeMeasureSpec(height,
				MeasureSpec.EXACTLY);
		

		super.onMeasure(widthMeasureSpec, heightMeasureSpec);
	}

	
	public enum  ScaleType{
		NORMAL, MIN_HEIGHT, MAX_HEIGHT
	}
}
