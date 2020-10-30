package com.chinatower.fghd.customer.home;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;

import com.chinatower.fghd.customer.Constant.Constant;
import com.chinatower.fghd.customer.location.LocationUtils;
import com.chinatower.fghd.customer.views.popupmenu.NIMPopupMenu;
import com.chinatower.fghd.customer.views.popupmenu.PopupMenuItem;
import com.chinatower.fghd.customer.vo.WebBean;
import com.chinatower.fghd.customer.vo.home.UserDetailInfo;
import com.chinatower.fghd.customer.web.WebViewActivity;

import java.util.ArrayList;
import java.util.List;

/**
 * @auther EnzoChan
 * created:2020/9/3
 * desc:
 */
public class ServiceHelper {

    private static ServiceHelper mServiceHelper;


    public static ServiceHelper getInstance() {

        if (mServiceHelper == null) {
            mServiceHelper = new ServiceHelper();
        }

        return mServiceHelper;

    }


    public void showDialog(Activity mActivity, UserDetailInfo mUserDetailInfo) {
        List<PopupMenuItem> list = new ArrayList<>();

        list.add(new PopupMenuItem("拨打电话", "拨打电话"));
        list.add(new PopupMenuItem("在线客服", "在线客服"));
        NIMPopupMenu popupMenu = new NIMPopupMenu(mActivity, list, new NIMPopupMenu.MenuItemClickListener() {
            @Override
            public void onItemClick(PopupMenuItem item) {
                if (item.getTitle().contains("拨打电话")) {

                    Intent intent = new Intent(Intent.ACTION_DIAL);
                    Uri data = Uri.parse("tel:10096");
                    intent.setData(data);
                    mActivity.startActivity(intent);
                } else if (item.getTitle().contains("在线客服")) {
                    WebBean mWebBean = new WebBean();
                    mWebBean.setTitle("在线客服");
                    String url = Constant.SERVICE_URL + mUserDetailInfo.getPhoneNumber() + "&nickName=" + mUserDetailInfo.getRealName() + "(" + mUserDetailInfo.getProvinceName() + mUserDetailInfo.getCityName() + ")";
                    mWebBean.setUrl(url);
                    WebViewActivity.startActivity(mActivity, mWebBean);

                }

            }

        }, NIMPopupMenu.TYPE_BG_WHITE, false);

        popupMenu.notifyData();
        popupMenu.showInParentCenter(mActivity);
    }
}
