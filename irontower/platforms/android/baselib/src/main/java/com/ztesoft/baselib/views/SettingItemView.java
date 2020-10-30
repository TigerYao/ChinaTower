package com.ztesoft.baselib.views;

import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.drawable.Drawable;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.ztesoft.baselib.R;


/**
 *
 */
public class SettingItemView extends LinearLayout {
    private Context context;

    private String bussinessName, bussinessDesc;

    private Drawable leftSrc;

    private ImageView bussinessDraw;

    private TextView bussinessNameTx, bussinessDescTx;

    public SettingItemView(Context context) {

        this(context, null);
        this.context = context;
    }

    public SettingItemView(final Context context, AttributeSet attrs) {

        super(context, attrs);
        this.context = context;
        LayoutInflater.from(context).inflate(R.layout.setting_item, this, true);

        TypedArray a = context.obtainStyledAttributes(attrs,
                R.styleable.personCenterItem);
        final int N = a.getIndexCount();
        for (int i = 0; i < N; i++) {
            int attr = a.getIndex(i);

            if (attr == R.styleable.personCenterItem_bussinessName) {
                bussinessName = a
                        .getString(R.styleable.personCenterItem_bussinessName);
            } else if (attr == R.styleable.personCenterItem_bussinessDesc) {
                bussinessDesc = a
                        .getString(R.styleable.personCenterItem_bussinessDesc);
            } else if (attr == R.styleable.personCenterItem_bussinessPicSrc) {
                leftSrc = a
                        .getDrawable(R.styleable.personCenterItem_bussinessPicSrc);
            } else if (attr == R.styleable.personCenterItem_showTopLine) {
                setViewVisiable(R.id.showtopline, a.getBoolean(attr, false));

            } else if (attr == R.styleable.personCenterItem_showMiddleLine) {
                setViewVisiable(R.id.showmiddleline, a.getBoolean(attr, false));

            } else if (attr == R.styleable.personCenterItem_showBottomLine) {
                setViewVisiable(R.id.showbottomline, a.getBoolean(attr, false));

            } else if (attr == R.styleable.personCenterItem_showRightArrows) {
                setViewVisiable(R.id.showarrows, a.getBoolean(attr, true));

            }
        }

        // System.out.println("titleName================"+titleName);
        a.recycle();
    }

    private void setViewVisiable(int viewId, boolean visiable) {
        View v = findViewById(viewId);
        int isvisiable = visiable ? View.VISIBLE : View.GONE;
        if (v != null) {
            v.setVisibility(isvisiable);
        }
    }

    @Override
    protected void onFinishInflate() {
        super.onFinishInflate();
        initBussinessDrawSrc();
        initBussinessNameTx();
        setBussinessName(bussinessName);
        setBussinessDesc(bussinessDesc);
        if (leftSrc != null) {
            initBussinessDrawSrc().setImageDrawable(leftSrc);
        } else {
            initBussinessDrawSrc().setVisibility(GONE);
        }
    }

    /**
     * 初始化业务的图片
     */
    public ImageView initBussinessDrawSrc() {
        if (bussinessDraw == null) {
            bussinessDraw = (ImageView) findViewById(R.id.item_icon);
        }
        return bussinessDraw;
    }

    /**
     * 初始化业务名称
     */
    public TextView initBussinessNameTx() {
        if (bussinessNameTx == null) {
            bussinessNameTx = (TextView) findViewById(R.id.item_text);
        }
        return bussinessNameTx;
    }

    /**
     * 初始化业务名称
     */
    public TextView initBussinessDescTx() {
        if (bussinessDescTx == null) {
            bussinessDescTx = (TextView) findViewById(R.id.item_desc);
        }
        return bussinessDescTx;
    }

    /**
     * 设置业务图片
     */
    public void setBussinessDrawSrc(int bussinessDrawSrc) {
        if (bussinessDraw != null) {
            bussinessDraw.setImageResource(bussinessDrawSrc);
        }
    }

    /**
     * 设置业务名称
     */
    public void setBussinessName(String bussinessName) {
        // if (bussinessName.length() > 13) {
        // bussinessNameTx.setTextSize(TypedValue.COMPLEX_UNIT_SP, 18);
        // }
        bussinessNameTx.setText(bussinessName);
    }

    /**
     * 设置业务名称
     */
    public void setBussinessName(int bussinessName) {
        setBussinessName(context.getString(bussinessName));
    }

    /***
     * 设置业务描述
     *
     * @param bussinessDesc
     */
    public void setBussinessDesc(String bussinessDesc) {
        if (TextUtils.isEmpty(bussinessDesc)) {
            initBussinessDescTx().setVisibility(View.GONE);
        } else {
            initBussinessDescTx().setVisibility(View.VISIBLE);
            initBussinessDescTx().setText(bussinessDesc);
        }
    }

    /**
     * 设置业务描述
     */
    public void setBussinessDesc(int bussinessName) {
        setBussinessDesc(context.getString(bussinessName));
    }

    public String getBussinessName() {
        return bussinessNameTx.getText().toString();
    }

}
