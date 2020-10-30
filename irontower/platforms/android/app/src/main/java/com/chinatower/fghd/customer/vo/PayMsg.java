package com.chinatower.fghd.customer.vo;

/**
 * @auther EnzoChan
 * created:2020-04-01
 * desc:
 */
public class PayMsg<T> {

    private String type;


    private T orderString;


    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public T getOrderString() {
        return orderString;
    }

    public void setOrderString(T orderString) {
        this.orderString = orderString;
    }
}
