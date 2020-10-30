package com.ztesoft.baselib.views.recycler;

/**
 * @auther EnzoChan
 * created:2020/10/12
 * desc:
 */

import android.content.Context;
import android.content.res.TypedArray;
import android.support.annotation.Nullable;
import android.support.v7.widget.RecyclerView;
import android.util.AttributeSet;

import com.ztesoft.baselib.R;

/**
 * max limit-able RecyclerView
 */
public class MaxLimitRecyclerView extends RecyclerView {
    private int mMaxHeight;
    private int mMaxWidth;
    public MaxLimitRecyclerView(Context context) {
        this(context, null);
    }
    public MaxLimitRecyclerView(Context context, @Nullable AttributeSet attrs) {
        this(context, attrs, 0);
    }
    public MaxLimitRecyclerView(Context context, @Nullable AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        inti(attrs);
    }
    private void inti(AttributeSet attrs) {
        if (getContext() != null && attrs != null) {
            TypedArray typedArray = null;
            try {
                typedArray = getContext().obtainStyledAttributes(attrs, R.styleable.MaxLimitRecyclerView);
                if (typedArray.hasValue(R.styleable.MaxLimitRecyclerView_limit_maxHeight)) {
                    mMaxHeight = typedArray.getDimensionPixelOffset(R.styleable.MaxLimitRecyclerView_limit_maxHeight, -1);
                }
                if (typedArray.hasValue(R.styleable.MaxLimitRecyclerView_limit_maxWidth)) {
                    mMaxWidth = typedArray.getDimensionPixelOffset(R.styleable.MaxLimitRecyclerView_limit_maxWidth, -1);
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (typedArray != null) {
                    typedArray.recycle();
                }
            }
        }
    }
    @Override
    protected void onMeasure(int widthSpec, int heightSpec) {
        super.onMeasure(widthSpec, heightSpec);
        boolean needLimit = false;
        if (mMaxHeight >= 0 || mMaxWidth >= 0) {
            needLimit = true;
        }
        if (needLimit) {
            int limitHeight = getMeasuredHeight();
            int limitWith = getMeasuredWidth();
            if (getMeasuredHeight() > mMaxHeight) {
                limitHeight = mMaxHeight;
            }
            if (getMeasuredWidth() > mMaxWidth) {
                limitWith = mMaxWidth;
            }
            setMeasuredDimension(limitWith, limitHeight);
        }
    }
}