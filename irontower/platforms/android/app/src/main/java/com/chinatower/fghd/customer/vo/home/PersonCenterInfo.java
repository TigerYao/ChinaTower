package com.chinatower.fghd.customer.vo.home;

/**
 * @auther EnzoChan
 * created:2020/8/24
 * desc:
 */
public class PersonCenterInfo {

    private String menuName;

    private Integer menuIcon;

    private String pushUrl;


    public PersonCenterInfo(String menuName, Integer menuIcon) {
        this.menuName = menuName;
        this.menuIcon = menuIcon;
    }

    public String getMenuName() {
        return menuName;
    }

    public void setMenuName(String menuName) {
        this.menuName = menuName;
    }

    public Integer getMenuIcon() {
        return menuIcon;
    }

    public void setMenuIcon(Integer menuIcon) {
        this.menuIcon = menuIcon;
    }


    public String getPushUrl() {
        return pushUrl;
    }

    public void setPushUrl(String pushUrl) {
        this.pushUrl = pushUrl;
    }
}
