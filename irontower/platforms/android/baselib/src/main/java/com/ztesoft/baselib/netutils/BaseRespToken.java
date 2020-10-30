package com.ztesoft.baselib.netutils;


/**
 * 返回数据基类
 *
 * @author
 */
public class BaseRespToken {


    /**
     * msg : 校验通过
     * data : {"token":"eyJhbGciOiJIUzI1NiIsImV4cCI6MTUwOTU2NTE0MjQyNiwidHlwIjoiSldUIn0=.eyJ1c2VybmFtZSI6IjE4MDUwMTk1NDUyIn0=.F05D2DEF8C5FA78BCB7706BCB8AE3349896F0A6D402BAE11370FC620EF2DCC30"}
     * status : 1
     */

    private String msg;
    private DataBean data;
    private int status;

    public boolean isSuccess() {
        if (status == 1) {
            return true;
        } else {
            return false;
        }
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public DataBean getData() {
        return data;
    }

    public void setData(DataBean data) {
        this.data = data;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }


    public static class DataBean {
        /**
         * token : eyJhbGciOiJIUzI1NiIsImV4cCI6MTUwOTU2NTE0MjQyNiwidHlwIjoiSldUIn0=.eyJ1c2VybmFtZSI6IjE4MDUwMTk1NDUyIn0=.F05D2DEF8C5FA78BCB7706BCB8AE3349896F0A6D402BAE11370FC620EF2DCC30
         */

        private String token;

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }
    }
}
