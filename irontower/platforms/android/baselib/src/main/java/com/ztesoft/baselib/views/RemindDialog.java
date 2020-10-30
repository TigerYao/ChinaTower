/**
 *
 */
package com.ztesoft.baselib.views;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import com.ztesoft.baselib.R;


/**
 * Created by ckf on 2016/6/14.
 * 提示框
 */
public class RemindDialog extends Dialog {


    TextView tvTitle;
    TextView tvContent;
    Button btnCancel;
    View viewLine;
    Button btnConfirm;
    EditText edit_content;
    ImageView ivTopIcon;
    private Context context;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //设置软键盘弹出顶起布局，部分布局不被遮挡
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE |
                WindowManager.LayoutParams.SOFT_INPUT_STATE_HIDDEN);
    }

    /**
     * @param context
     */
    public RemindDialog(Context context) {
        super(context, R.style.setting_dialog_style);
        this.setContentView(R.layout.remind_dialog);
        this.context = context;
        init();
    }

    public RemindDialog(Context context, boolean cancelable,
                        OnCancelListener cancelListener) {
        super(context, cancelable, cancelListener);
        this.setContentView(R.layout.remind_dialog);
        this.context = context;
        init();
    }

    public RemindDialog(Context context, int theme) {

        super(context, theme);
        this.setContentView(R.layout.remind_dialog);
        this.context = context;
        init();
    }


    private void init() {
        tvTitle = (TextView) this.findViewById(R.id.tv_title);
        ivTopIcon = (ImageView) this.findViewById(R.id.iv_top_icon);
        tvContent = (TextView) this.findViewById(R.id.tv_content);
        btnCancel = (Button) this.findViewById(R.id.btn_cancel);
        btnConfirm = (Button) this.findViewById(R.id.btn_confirm);
        edit_content = (EditText) this.findViewById(R.id.edit_content);
        viewLine = (View) this.findViewById(R.id.view_line);

    }

    public void setContent(String content) {

        tvContent.setVisibility(View.VISIBLE);
        tvContent.setText(content);

    }

    public void setTitle(String title) {
        tvTitle.setVisibility(View.VISIBLE);
        tvTitle.setText(title);
    }

    public void setButtonInfoLeft(String bt1text, View.OnClickListener onClickListener) {
        btnCancel.setText(bt1text);
        btnCancel.setOnClickListener((View.OnClickListener) onClickListener);
    }

    public void setButtonInfoRight(String bt1text, View.OnClickListener onClickListener) {
        btnConfirm.setText(bt1text);
        btnConfirm.setOnClickListener((View.OnClickListener) onClickListener);

    }

    public void setOneButtonLeft(String bt1text, View.OnClickListener onClickListener) {

        btnCancel.setText(bt1text);
        btnCancel.setOnClickListener((View.OnClickListener) onClickListener);
        viewLine.setVisibility(View.GONE);
        btnConfirm.setVisibility(View.GONE);

    }


    /**
     * 设置单个按钮，取消对话框
     *
     * @param text
     */
    public void setButtonDismiss(String text) {

        btnCancel.setText(text);
        btnCancel.setTextColor(context.getResources().getColor(R.color.android_white));
        btnCancel.setBackgroundColor(context.getResources().getColor(R.color.theme_color));
        btnCancel.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                RemindDialog.this.dismiss();
            }
        });
        viewLine.setVisibility(View.GONE);
        btnConfirm.setVisibility(View.GONE);

    }


    public void setIvTopIcon(int drawable) {
        if (ivTopIcon != null) {
            ivTopIcon.setImageResource(drawable);
            ivTopIcon.setVisibility(View.VISIBLE);
        }
    }


    public void setEditVisibility(String hint) {
        edit_content.setVisibility(View.VISIBLE);
        edit_content.setHint(hint);
        tvContent.setVisibility(View.GONE);
    }

    public EditText getEdit() {
        return edit_content;
    }

    @Override
    public void show() {
        if (!((Activity) context).isFinishing()) {
            try {
                super.show();
            } catch (Exception e) {
                System.out.println("show错误" + e.getMessage());
            }
        }else {
            System.out.println("show错误 context is finish");

        }


    }

    @Override
    public void dismiss() {
        //	countTimer.cancel();
        try {
            super.dismiss();
        } catch (Exception e) {
            System.out.println("dismiss错误");
        }
    }

}
