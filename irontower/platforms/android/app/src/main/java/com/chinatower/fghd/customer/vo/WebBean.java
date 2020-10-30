package com.chinatower.fghd.customer.vo;

import java.io.Serializable;

/**
 * @auther EnzoChan
 * created:2020-04-16
 * desc:
 */
public class WebBean implements Serializable {
    private String title;
    private String url;


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
