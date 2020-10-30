package com.chinatower.fghd.customer.vo.home;

/**
 * @auther EnzoChan
 * created:2020/8/26
 * desc:
 */
public class ShareLinkInfo {

    /**
     * appShareLink : http://fx.chinatowercom.cn:8091/base/public/userShare/shareToHtml
     * appShareContent : 中国铁塔能源有限公司依托中国铁塔动力电池的备电使用经验、规模采购优势、专业化维护能力和可视、可管、可控的智能监控系统，以高能效动力电池为载体，主要面向金融、交通、医疗、低速电动车客户群体及一般工商业用户提供备电、发电、充电、换电、储能等电力保障和能源服务，打造全国性的电力保障与能源服务专业化公司。其中，换电业务主要是针对快递物流、餐饮外卖行业开展低速电动车的共享电池业务。
     * appShareImage : http://powerexchangeapp.chinatowercom.cn:7621/group1/M00/00/00/CigBz17nZ16AYzCqAAAytXDNfw8210.png
     * appShareTitle : 欢迎下载铁塔换电APP
     */

    private String appShareLink;
    private String appShareContent;
    private String appShareImage;
    private String appShareTitle;

    public String getAppShareLink() {
        return appShareLink;
    }

    public void setAppShareLink(String appShareLink) {
        this.appShareLink = appShareLink;
    }

    public String getAppShareContent() {
        return appShareContent;
    }

    public void setAppShareContent(String appShareContent) {
        this.appShareContent = appShareContent;
    }

    public String getAppShareImage() {
        return appShareImage;
    }

    public void setAppShareImage(String appShareImage) {
        this.appShareImage = appShareImage;
    }

    public String getAppShareTitle() {
        return appShareTitle;
    }

    public void setAppShareTitle(String appShareTitle) {
        this.appShareTitle = appShareTitle;
    }
}
