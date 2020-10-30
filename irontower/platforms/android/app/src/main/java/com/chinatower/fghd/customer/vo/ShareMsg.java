package com.chinatower.fghd.customer.vo;

import java.io.Serializable;

/**
 * @auther EnzoChan
 * created:2020-04-02
 * desc:
 */
public class ShareMsg implements Serializable {


    /**
     * title : 下载铁塔换电App
     * url : https://www.baidu.com
     * icon : https://t8.baidu.com/it/u=3571592872,3353494284&fm=79&app=86&size=h300&n=0&g=4n&f=jpeg?sec=1585724896&t=15b5157475b4a6ba2463ae1a41c1ef3f
     * description : 注意: 在新版的Cocoapods中,必须要制定target   也就是你的项目名称!!!!!
     */

    private String type;
    private String title;
    private String url;
    private String icon;
    private String description;

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

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
