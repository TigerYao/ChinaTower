package com.chinatower.fghd.customer.location;

import android.app.Activity;
import android.view.View;
import android.widget.Toast;

import com.chinatower.fghd.customer.views.popupmenu.NIMPopupMenu;
import com.chinatower.fghd.customer.views.popupmenu.PopupMenuItem;
import com.chinatower.fghd.customer.vo.NaviBean;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * @auther EnzoChan
 * created:2020/6/9
 * desc:
 */
public class NaviPopWindow {
    public static void show(Activity mContext, View v, NaviBean mNaviBean, double myLongitude, double myLatitude) {
        List<PopupMenuItem> list = new ArrayList<>();

        if (isInstallPackage("com.baidu.BaiduMap")) {
            list.add(new PopupMenuItem("百度地图", "百度地图"));

        }
        if (isInstallPackage("com.autonavi.minimap")) {
            list.add(new PopupMenuItem("高德地图", "高德地图"));
        }

        if (list.size() == 0) {
            Toast.makeText(mContext, "请先安装导航软件", Toast.LENGTH_LONG).show();
        } else {
//            list.add(new PopupMenuItem("取消", "取消"));
            NIMPopupMenu popupMenu = new NIMPopupMenu(mContext, list, new NIMPopupMenu.MenuItemClickListener() {
                @Override
                public void onItemClick(PopupMenuItem item) {
                    if (item.getTitle().contains("百度")) {
                        LocationUtils.openBaiduMap(mContext,
                                (mNaviBean.getLat()),
                                (mNaviBean.getLng()), myLatitude, myLongitude,
                                mNaviBean.getName(), mNaviBean.getOrigin(), mNaviBean.getMode(), mNaviBean.getAddr());
                    } else if (item.getTitle().contains("高德")) {
                        LocationUtils.openGaoDeMap(mContext, Double.parseDouble(mNaviBean.getLng()),
                                Double.parseDouble(mNaviBean.getLat()), mNaviBean.getName(), mNaviBean.getAddr(), mNaviBean.getMode());
                    }
                }

            }, NIMPopupMenu.TYPE_BG_WHITE, false);

            popupMenu.notifyData();
            popupMenu.showInParentCenter(mContext);
        }


    }

    private static boolean isInstallPackage(String packageName) {
        return new File("/data/data/" + packageName).exists();
    }
}
