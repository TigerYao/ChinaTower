package com.chinatower.fghd.customer.vo;

import java.io.Serializable;

/**
 * @auther EnzoChan
 * created:2020-04-26
 * desc:
 */
public class JpushTypeBean implements Serializable {
    private String type;

    private String noticeId;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getNoticeId() {
        return noticeId;
    }

    public void setNoticeId(String noticeId) {
        this.noticeId = noticeId;
    }
}
