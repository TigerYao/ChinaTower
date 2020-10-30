package com.chinatower.fghd.customer.vo;

/**
 * @auther EnzoChan
 * created:2020-04-07
 * desc:
 */
public class MethodBean <T>{


    /**
     * method : getCurrentPosition
     */

    private String method;

    private T params;

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public T getParams() {
        return params;
    }

    public void setParams(T params) {
        this.params = params;
    }
}
