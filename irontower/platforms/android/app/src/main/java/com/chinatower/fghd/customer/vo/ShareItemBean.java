package com.chinatower.fghd.customer.vo;



import com.chinatower.fghd.customer.R;

import java.util.ArrayList;
import java.util.List;

/**
 * @auther EnzoChan
 * created:2020-04-02
 * desc:
 */
public class ShareItemBean {

    private Integer iconUrl;

    private String name;


    private ShareType shareType;

    public Integer getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(Integer iconUrl) {
        this.iconUrl = iconUrl;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ShareType getShareType() {
        return shareType;
    }

    public void setShareType(ShareType shareType) {
        this.shareType = shareType;
    }

    public enum ShareType {
        WX, PYQ, DING_DING, QQ, MSG
    }


    public static List<ShareItemBean> getShareList() {

        List<ShareItemBean> itemBeans = new ArrayList<>();




        ShareItemBean itemBean = new ShareItemBean();
        itemBean.setIconUrl(R.mipmap.share_wx);
        itemBean.setShareType(ShareType.WX);
        itemBean.setName("微信");
        itemBeans.add(itemBean);

        ShareItemBean itemBean1 = new ShareItemBean();
        itemBean1.setIconUrl(R.mipmap.share_pyq);
        itemBean1.setShareType(ShareType.PYQ);
        itemBean1.setName("朋友圈");
        itemBeans.add(itemBean1);

        return itemBeans;
    }
}
