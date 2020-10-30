package com.chinatower.fghd.customer.home.adapter;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.chinatower.fghd.customer.Constant.Constant;
import com.chinatower.fghd.customer.MainActivity;
import com.chinatower.fghd.customer.R;
import com.chinatower.fghd.customer.api.ITowerBusiness;
import com.chinatower.fghd.customer.home.ServiceHelper;
import com.chinatower.fghd.customer.share.ShareActivity;
import com.chinatower.fghd.customer.util.UserInfoUtils;
import com.chinatower.fghd.customer.vo.ShareMsg;
import com.chinatower.fghd.customer.vo.home.PersonCenterInfo;
import com.chinatower.fghd.customer.vo.home.ShareLinkInfo;
import com.chinatower.fghd.customer.vo.home.UserDetailInfo;
import com.ztesoft.baselib.base.KBaseRecyclerAdapter;
import com.ztesoft.baselib.netutils.BaseResp;
import com.ztesoft.baselib.netutils.HRetrofitNetHelper;
import com.ztesoft.baselib.views.RemindDialog;
import com.ztesoft.baselib.views.ToastView;

import retrofit2.Call;

/**
 * @auther EnzoChan
 * created:2020/8/24
 * desc:
 */
public class PersonCenterAdapter extends KBaseRecyclerAdapter<PersonCenterInfo> {


    private onItemClickListener onItemClickListener;


    public void setOnItemClickListener(PersonCenterAdapter.onItemClickListener onItemClickListener) {
        this.onItemClickListener = onItemClickListener;
    }

    public interface onItemClickListener {
        void onClick(View v);
    }

    public PersonCenterAdapter(Context context) {
        super(context);
    }

    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.person_center_item_layout, parent, false);
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
        private TextView tvMenuName;

        private ImageView ivMenuIcon;

        private LinearLayout llMenu;

        public ViewHolder(View itemView) {
            super(itemView);
            tvMenuName = itemView.findViewById(R.id.tv_menu_name);
            ivMenuIcon = itemView.findViewById(R.id.iv_menu_icon);
            llMenu = itemView.findViewById(R.id.ll_menu);
        }

        public void bindData(int position) {
            PersonCenterInfo info = itemList.get(position);

            tvMenuName.setText(info.getMenuName());


            ivMenuIcon.setImageResource(info.getMenuIcon());

            llMenu.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (onItemClickListener != null) {
                        onItemClickListener.onClick(v);
                    }

                    if (info.getPushUrl().contains("local,")) {
                        if (info.getPushUrl().contains("share")) {
                            //分享
                            getAppShareLink();
                        } else if (info.getPushUrl().contains("service")) {
                            //客服
                            UserDetailInfo userDetailInfo = UserInfoUtils.getUserDetailInfo(context);

                            ServiceHelper.getInstance().showDialog((Activity) context, userDetailInfo);

                        }
                    } else {
                        if (info.getPushUrl().contains("qrCodeInvate")) {
                            //老带新
                            UserDetailInfo userDetailInfo = UserInfoUtils.getUserDetailInfo(context);
                            if (!userDetailInfo.getCertification().equals("1")) {
                                //未实名
                                showDialog("老带新功能，需实名认证并购买套餐后才能使用。请您确认是否先去实名认证？", "#/realNameAuth");
                            } else if (userDetailInfo.getAvailableDays() <= 0) {
                                //未购买套餐
                                showDialog("老带新功能，需购买套餐后才能使用。请您确认是否购买套餐？", "#/myWallet");
                            } else {
                                toWebPage(info.getPushUrl());
                            }
                        } else {
                            toWebPage(info.getPushUrl());
                        }
                    }

                }
            });


        }

        private void getAppShareLink() {
            HRetrofitNetHelper retrofitNetHelper = HRetrofitNetHelper.getInstance(context);
            ITowerBusiness iCloudBusiness = retrofitNetHelper.getAPIService(ITowerBusiness.class);

            Call<BaseResp<ShareLinkInfo>> call = iCloudBusiness.getAppShareLink();

            retrofitNetHelper.enqueueCall(call, new HRetrofitNetHelper.RetrofitCallBack<ShareLinkInfo>() {
                @Override
                public void onSuccess(BaseResp<ShareLinkInfo> baseResp) {

                    ShareLinkInfo info = baseResp.getResultObject();
                    ShareMsg msg = new ShareMsg();
                    msg.setType("webpage");
                    msg.setDescription(info.getAppShareContent());
                    msg.setUrl(info.getAppShareLink());
                    msg.setTitle(info.getAppShareTitle());
                    ShareActivity.startActivity(context, msg);
                }

                @Override
                public void onFailure(String error) {

                    ToastView.showLong(error);
                }
            });
        }


        public void showDialog(String content, String toUrl) {
            RemindDialog dialog = new RemindDialog(context);
            dialog.setTitle("温馨提示");
            dialog.setContent(content);
            dialog.setButtonInfoRight("确定", new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    dialog.dismiss();
                    toWebPage(toUrl);
                }
            });

            dialog.setButtonInfoLeft("取消", new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    dialog.dismiss();
                }
            });

            dialog.show();


        }

        public void toWebPage(String pageUrl) {
            Intent mIntent = new Intent(context, MainActivity.class);
            mIntent.putExtra(Constant.TRAN_DATA_KEY, pageUrl);

            context.startActivity(mIntent);
            ((Activity) context).overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);

        }
    }
}
