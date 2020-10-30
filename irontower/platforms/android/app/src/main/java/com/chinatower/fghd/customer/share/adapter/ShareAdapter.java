package com.chinatower.fghd.customer.share.adapter;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.chinatower.fghd.customer.R;
import com.chinatower.fghd.customer.vo.ShareItemBean;
import com.ztesoft.baselib.base.KBaseRecyclerAdapter;

/**
 * @auther EnzoChan
 * created:2020-04-02
 * desc:
 */
public class ShareAdapter extends KBaseRecyclerAdapter<ShareItemBean> {

    private View.OnClickListener onClickListener;

    public void setOnClickListener(View.OnClickListener onClickListener) {
        this.onClickListener = onClickListener;
    }

    public ShareAdapter(Context context) {
        super(context);
    }

    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.share_popu_item_layout, parent, false);
        ViewHolder holder = new ViewHolder(view);
        return holder;
    }

    @Override
    public void onBindViewHolder(RecyclerView.ViewHolder holder, int position) {
        if (holder instanceof ViewHolder) {
            ((ViewHolder) holder).bindData(position);
        }
    }


    public class ViewHolder extends RecyclerView.ViewHolder {
        private TextView tvName;

        private ImageView ivIcon;

        private LinearLayout llItem;

        public ViewHolder(View itemView) {
            super(itemView);
            tvName = itemView.findViewById(R.id.tv_name);
            ivIcon = itemView.findViewById(R.id.iv_icon);
            llItem = itemView.findViewById(R.id.ll_item);
        }

        public void bindData(int position) {
            ShareItemBean itemBean = itemList.get(position);

            tvName.setText(itemBean.getName());
            ivIcon.setImageDrawable(context.getDrawable(itemBean.getIconUrl()));
            llItem.setTag(itemBean);
            llItem.setOnClickListener(onClickListener);
        }
    }
}
