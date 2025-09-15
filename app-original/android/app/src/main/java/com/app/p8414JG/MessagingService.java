package com.app.p8414JG;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import android.util.Log;
import com.salesforce.marketingcloud.messages.push.PushMessageManager;
import com.salesforce.marketingcloud.sfmcsdk.SFMCSdk;

public class MessagingService extends FirebaseMessagingService {

    private static final String TAG = "MessagingService";

    @Override
    public void onMessageReceived(RemoteMessage message) {
        super.onMessageReceived(message);

//        IMPLEMENTACION PARA RECIBIR MENSAJES DE AMBAS API (FIREBASE, SFMC)
        Log.d("FCM-SERVICE","FIREBASE MESSAGE RECEIVED");
        if (PushMessageManager.isMarketingCloudPush(message)) {
            SFMCSdk.requestSdk(sdk ->{
                sdk.mp(it -> {
                    it.getPushMessageManager().handleMessage(message);
                });
            });
        }else{
            super.onMessageReceived(message);
        }
    }
}
