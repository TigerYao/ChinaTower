package com.chinatower.fghd.customer.vo;

/**
 * @auther EnzoChan
 * created:2020-04-08
 * desc:
 */
public class GpsInfo {

    private double longitude, latitude;

    private String platform;

    private String city;
    private String privce;
    private String area;
    private String address;
    private String county;


    public GpsInfo(double longitude, double latitude) {
        this.longitude = longitude;
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPrivce() {
        return privce;
    }

    public void setPrivce(String privce) {
        this.privce = privce;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCounty() {
        return county;
    }

    public void setCounty(String county) {
        this.county = county;
    }
}
