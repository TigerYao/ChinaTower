package com.ztesoft.baselib.views;

import android.app.Activity;
import android.content.Context;
import android.content.res.TypedArray;
import android.util.AttributeSet;
import android.util.TypedValue;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.ztesoft.baselib.R;


/***
 * 标题头
 */

public class ActivityTitle extends RelativeLayout {
    private Context context;

    private CharSequence titleName, btnBackVisibility, btnRightVisibility;

    private TextView iTvTitleRight, tv_TitleName;

    private ImageView iTvTitleLeft, ivTitleRight;


    public ActivityTitle(Context context) {

        this(context, null);
        this.context = context;
    }

    public ActivityTitle(final Context context, AttributeSet attrs) {

        super(context, attrs);
        this.context = context;
        LayoutInflater.from(context).inflate(
                R.layout.baseframework_layout_title, this, true);

        TypedArray a = context.obtainStyledAttributes(attrs,
                R.styleable.LayoutTitle);
        final int N = a.getIndexCount();
        for (int i = 0; i < N; i++) {
            int attr = a.getIndex(i);

            if (attr == R.styleable.LayoutTitle_btnBackVisibility) {
                btnBackVisibility = a
                        .getString(R.styleable.LayoutTitle_btnBackVisibility);
            } else if (attr == R.styleable.LayoutTitle_btnRightVisibility) {
                initBtnTitleRight();
                btnRightVisibility = a
                        .getString(R.styleable.LayoutTitle_btnRightVisibility);
                if (btnRightVisibility != null) {
                    iTvTitleRight.setVisibility(View.VISIBLE);
                }
            } else if (attr == R.styleable.LayoutTitle_btnRightText) {
                initBtnTitleRight();
                String str = a.getString(R.styleable.LayoutTitle_btnRightText);
                if (str != null) {
                    iTvTitleRight.setText(str);
                    iTvTitleRight.setVisibility(View.VISIBLE);
                }
            } else if (attr == R.styleable.LayoutTitle_btnLeftText) {
                initBtnTitleLeft();
                String leftStr = a
                        .getString(R.styleable.LayoutTitle_btnLeftText);
                if (leftStr != null) {
                    iTvTitleLeft.setVisibility(View.VISIBLE);
                }
            } else if (attr == R.styleable.LayoutTitle_titleName) {
                titleName = a.getText(R.styleable.LayoutTitle_titleName);

            } else if (attr == R.styleable.LayoutTitle_rightImageSrc) {
                int src = a
                        .getResourceId(R.styleable.LayoutTitle_rightImageSrc, R.drawable.title_more_bg);
                setRightImageView(src);
            }
        }

        // System.out.println("titleName================"+titleName);
        // a.recycle();
    }

    /**
     * 初始化右边的按钮
     */
    private void initBtnTitleRight() {
        if (iTvTitleRight == null) {
            iTvTitleRight = (TextView) findViewById(R.id.iTvTitleRight);
        }
    }

    /**
     * 初始化左边边的按钮
     */
    public ImageView initBtnTitleLeft() {
        if (iTvTitleLeft == null) {
            iTvTitleLeft = (ImageView) findViewById(R.id.iTvTitleLeft);
        }
        return iTvTitleLeft;
    }

    @Override
    protected void onFinishInflate() {
        // TODO Auto-generated method stub
        super.onFinishInflate();
        initBtnTitleLeft();
        if (btnBackVisibility == null) {
            iTvTitleLeft.setOnClickListener(new OnClickListener() {
                @Override
                public void onClick(View v) {
                    ((Activity) context).finish();
                }
            });
        } else {
            iTvTitleLeft.setVisibility(View.INVISIBLE);
        }
        getTitleNameTv();
        tv_TitleName.setText(titleName);

    }

    /***
     * 得到左边
     *
     * @return
     */
    public ImageView getTitleLeft() {
        initBtnTitleLeft();
        return iTvTitleLeft;
    }

    /**
     * 得到右边
     *
     * @return
     */
    public TextView getTitleRight() {
        initBtnTitleRight();
        return iTvTitleRight;
    }

    /**
     * 隐藏右边的
     *
     * @return
     */
    public void setVisibilityRightBtn(int vis) {
        iTvTitleRight.setVisibility(vis);
    }

    /**
     * 得到标题的TextView
     *
     * @return
     */
    public TextView getTitleNameTv() {
        if (tv_TitleName == null)
            tv_TitleName = (TextView) findViewById(R.id.tv_TitleName);
        return tv_TitleName;
    }

    /**
     * 设置Activity标题名称
     *
     * @param strtitleName
     */
    public void setTitleName(String strtitleName) {
        if (strtitleName.length() > 13) {
            tv_TitleName.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18);
        }
        tv_TitleName.setText(strtitleName);
    }

    /**
     * 设置Activity标题名称
     *
     * @param strtitleName
     */
    public void setTitleName(int strtitleName) {
        setTitleName(context.getString(strtitleName));
    }


    public void setRightImageView(int resId) {
        if (ivTitleRight == null) {
            ivTitleRight = (ImageView) findViewById(R.id.ivTitleRight);
        }
        ivTitleRight.setVisibility(View.VISIBLE);
        ivTitleRight.setImageResource(resId);
    }
}
