package com.chinatower.fghd.customer.vo;

/**
 * @auther EnzoChan
 * created:2020-04-01
 * desc:
 */
public class WXPayInfo {


    /**
     * appid : wxe6b4508da29eeb85
     * partnerId : 1535212481
     * nonceStr : 1585735774137
     * sign : 20942CDC6D9623D21829761343897ECF
     * prepayId : wx0118093410150364bffb71731000043000
     * timeStamp : 1585735774
     */

    private String appid;
    private String partnerId;
    private String nonceStr;
    private String sign;
    private String prepayId;
    private String timeStamp;

    public String getAppid() {
        return appid;
    }

    public void setAppid(String appid) {
        this.appid = appid;
    }

    public String getPartnerId() {
        return partnerId;
    }

    public void setPartnerId(String partnerId) {
        this.partnerId = partnerId;
    }

    public String getNonceStr() {
        return nonceStr;
    }

    public void setNonceStr(String nonceStr) {
        this.nonceStr = nonceStr;
    }

    public String getSign() {
        return sign;
    }

    public void setSign(String sign) {
        this.sign = sign;
    }

    public String getPrepayId() {
        return prepayId;
    }

    public void setPrepayId(String prepayId) {
        this.prepayId = prepayId;
    }

    public String getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(String timeStamp) {
        this.timeStamp = timeStamp;
    }
}
