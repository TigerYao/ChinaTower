package com.chinatower.fghd.customer.vo;

import java.io.Serializable;

/**
 * @auther EnzoChan
 * created:2020/8/24
 * desc:
 */
public class UserInfo implements Serializable {


    /**
     * driverId : 505d9aef165344119d0b429af7db0738
     * account : 18050195452
     * avatar : http://180.153.28.159:81/group1/M00/00/04/rBH6Fl6gDR2AII-uAAAKqlerY3w687.png
     * nickName : null
     * sex : 0
     * realName : 陈坤峰
     * realNamePinyin : null
     * idCard : 350521199012286051
     * phoneNumber : 18050195452
     * loginCount : 0
     * lastLoginTime : null
     * provinceId : 350000
     * cityId : 350100
     * orgId : 100003
     * deptId : 350100
     * token : eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTgyNTI4MjYsInN1YiI6IjUwNWQ5YWVmMTY1MzQ0MTE5ZDBiNDI5YWY3ZGIwNzM4In0.P5n2lL48vvTVl4UO0eIziqmBevOiCr1XBfLkDLX52xA
     * certification : 0
     */

    private String driverId;
    private String account;
    private String avatar;
    private String nickName;
    private String sex;
    private String realName;
    private String realNamePinyin;
    private String idCard;
    private String phoneNumber;
    private int loginCount;
    private String lastLoginTime;
    private String provinceId;
    private String cityId;
    private String orgId;
    private String orgType;
    private String deptId;
    private String token;
    private String certification;
    private String driverType;

    public String getDriverId() {
        return driverId;
    }

    public void setDriverId(String driverId) {
        this.driverId = driverId;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    public String getRealNamePinyin() {
        return realNamePinyin;
    }

    public void setRealNamePinyin(String realNamePinyin) {
        this.realNamePinyin = realNamePinyin;
    }

    public String getIdCard() {
        return idCard;
    }

    public void setIdCard(String idCard) {
        this.idCard = idCard;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public int getLoginCount() {
        return loginCount;
    }

    public void setLoginCount(int loginCount) {
        this.loginCount = loginCount;
    }

    public String getLastLoginTime() {
        return lastLoginTime;
    }

    public void setLastLoginTime(String lastLoginTime) {
        this.lastLoginTime = lastLoginTime;
    }

    public String getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(String provinceId) {
        this.provinceId = provinceId;
    }

    public String getCityId() {
        return cityId;
    }

    public void setCityId(String cityId) {
        this.cityId = cityId;
    }

    public String getOrgId() {
        return orgId;
    }

    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }

    public String getDeptId() {
        return deptId;
    }

    public void setDeptId(String deptId) {
        this.deptId = deptId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getCertification() {
        return certification;
    }

    public void setCertification(String certification) {
        this.certification = certification;
    }

    public String getOrgType() {
        return orgType;
    }

    public void setOrgType(String orgType) {
        this.orgType = orgType;
    }

    public String getDriverType() {
        return driverType;
    }

    public void setDriverType(String driverType) {
        this.driverType = driverType;
    }

    public String getBearerToken() {
        return "Bearer " + token;
    }
}
