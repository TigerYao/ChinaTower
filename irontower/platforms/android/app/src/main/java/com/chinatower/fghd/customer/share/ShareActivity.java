package com.chinatower.fghd.customer.share;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.TextView;

import com.chinatower.fghd.customer.R;
import com.chinatower.fghd.customer.share.adapter.ShareAdapter;
import com.chinatower.fghd.customer.util.WxUtil;
import com.chinatower.fghd.customer.vo.ShareItemBean;
import com.chinatower.fghd.customer.vo.ShareMsg;
import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.modelmsg.WXTextObject;
import com.tencent.mm.opensdk.modelmsg.WXWebpageObject;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

public class ShareActivity extends Activity implements View.OnClickListener {

    private RecyclerView mReycler;
    /**
     * 取消
     */
    private TextView mTvCancle;


    private ShareAdapter mAdapter;

    ShareMsg mShareMsg;
    IWXAPI api;

    public static void startActivity(Context context, ShareMsg msg) {
        Intent mIntent = new Intent(context, ShareActivity.class);
        mIntent.putExtra("data", msg);
        ((Activity) context).startActivityForResult(mIntent, 1002);

    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_share);
        //wxe6b4508da29eeb85
        api = WXAPIFactory.createWXAPI(this, "wxdc946658fe1c020a");

        mShareMsg = (ShareMsg) getIntent().getSerializableExtra("data");
        initView();
    }

    private void initView() {
        mReycler = findViewById(R.id.reycler);
        mTvCancle = findViewById(R.id.tv_cancle);
        mTvCancle.setOnClickListener(this);
        findViewById(R.id.rl_content).setOnClickListener(this);
        mAdapter = new ShareAdapter(this);
        mReycler.setLayoutManager(new GridLayoutManager(this, 4));
        if (api.isWXAppInstalled()) {
            mAdapter.setItems(ShareItemBean.getShareList());
        }
        ShareItemBean itemBean = new ShareItemBean();
        itemBean.setName("短信");
        itemBean.setShareType(ShareItemBean.ShareType.MSG);
        itemBean.setIconUrl(R.mipmap.share_msg);
        mAdapter.getItem().add(itemBean);
        mReycler.setAdapter(mAdapter);
        mAdapter.setOnClickListener(this);

    }

    @Override
    public void onClick(View v) {

        switch (v.getId()) {
            case R.id.tv_cancle:
            case R.id.rl_content:
                setResult(RESULT_CANCELED);
                finish();
                break;
            case R.id.ll_item:
                ShareItemBean itemBean = (ShareItemBean) v.getTag();
                if (itemBean.getShareType().ordinal() == ShareItemBean.ShareType.WX.ordinal() ||
                        itemBean.getShareType().ordinal() == ShareItemBean.ShareType.PYQ.ordinal()) {
                    shareWx(itemBean);
                } else if (itemBean.getShareType().ordinal() == ShareItemBean.ShareType.MSG.ordinal()) {
                    //短信
                    shareMsg();
                }
                finish();
                break;
        }


    }

    /**
     * 发短信
     */
    private void shareMsg() {
        String smsBody = null;
        if (mShareMsg.getType().equals("webpage")) {
            smsBody = mShareMsg.getDescription() + mShareMsg.getUrl();
        } else {
            smsBody = mShareMsg.getDescription();

        }
        Uri smsToUri = Uri.parse("smsto:");
        Intent sendIntent = new Intent(Intent.ACTION_VIEW, smsToUri);
        //sendIntent.putExtra("address", "123456"); // 电话号码，这行去掉的话，默认就没有电话
        //短信内容
        sendIntent.putExtra("sms_body", smsBody);
        sendIntent.setType("vnd.android-dir/mms-sms");
        startActivityForResult(sendIntent, 1000);
    }


    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        finish();
        if (resultCode != RESULT_OK) {
        } else {
        }

    }

    private String buildTransaction(final String type) {
        return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
    }

    public void shareWx(ShareItemBean itemBean) {

        //初始化一个WXWebpageObject，填写url

        if (mShareMsg.getType().equals("webpage")) {
            WXWebpageObject webpage = new WXWebpageObject();
            webpage.webpageUrl = mShareMsg.getUrl();

            //用 WXWebpageObject 对象初始化一个 WXMediaMessage 对象
            WXMediaMessage msg = new WXMediaMessage(webpage);
            msg.title = mShareMsg.getTitle();
            msg.description = mShareMsg.getDescription();
            Bitmap thumbBmp = BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher);
            msg.thumbData = WxUtil.bmpToByteArray(thumbBmp, true);

            //构造一个Req
            SendMessageToWX.Req req = new SendMessageToWX.Req();
            req.transaction = buildTransaction("webpage");
            req.message = msg;
            req.scene = itemBean.getShareType().ordinal() == ShareItemBean.ShareType.WX.ordinal() ?
                    SendMessageToWX.Req.WXSceneSession : SendMessageToWX.Req.WXSceneTimeline;

            //调用api接口，发送数据到微信
            api.sendReq(req);
        } else if (mShareMsg.getType().equals("text")) {
            //初始化一个 WXTextObject 对象，填写分享的文本内容
            WXTextObject textObj = new WXTextObject();
            textObj.text = mShareMsg.getDescription();

            //用 WXTextObject 对象初始化一个 WXMediaMessage 对象
            WXMediaMessage msg = new WXMediaMessage();
            msg.mediaObject = textObj;
            msg.description = mShareMsg.getDescription();

            SendMessageToWX.Req req = new SendMessageToWX.Req();
            req.transaction = buildTransaction("text");
            req.message = msg;
            req.scene = itemBean.getShareType().ordinal() == ShareItemBean.ShareType.WX.ordinal() ?
                    SendMessageToWX.Req.WXSceneSession : SendMessageToWX.Req.WXSceneTimeline;
            //调用api接口，发送数据到微信
            api.sendReq(req);

        }

    }
}
