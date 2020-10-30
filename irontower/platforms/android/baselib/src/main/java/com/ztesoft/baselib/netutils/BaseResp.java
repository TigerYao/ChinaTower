package com.ztesoft.baselib.netutils;


/**
 * 返回数据基类
 *
 * @author
 */
public class BaseResp<T> {

    private String resultCode;
    private String resultMsg;
    private T resultObject;


    public String getCode() {
        return resultCode;
    }

    public void setCode(String code) {
        this.resultCode = code;
    }

    public String getResultMsg() {
        return resultMsg;
    }

    public void setResultMsg(String resultMsg) {
        this.resultMsg = resultMsg;
    }

    public T getResultObject() {
        return resultObject;
    }

    public void setResultObject(T resultObject) {
        this.resultObject = resultObject;
    }


    public boolean isSuccess() {
        if (resultCode.equals("000")) {
            return true;
        } else {
            return false;
        }
    }


}
