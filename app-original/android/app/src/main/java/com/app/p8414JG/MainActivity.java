package com.app.p8414JG;

import android.os.Bundle;
import android.util.Log;
import com.getcapacitor.BridgeActivity;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.salesforce.marketingcloud.sfmcsdk.SFMCSdk;

public class MainActivity extends BridgeActivity {

    private static final String TAG = "MainActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Llama al método para obtener el token de Firebase
        getFirebaseToken();
    }

    private void getFirebaseToken() {
        try {
            FirebaseMessaging.getInstance().getToken().addOnCompleteListener(new OnCompleteListener<String>() {
                @Override
                public void onComplete(Task<String> task) {
                    if (task.isSuccessful()) {
                        String token = task.getResult();
                        Log.d(TAG, "FCM Token: " + token);
                        SFMCSdk.requestSdk(sdk -> {
                            sdk.mp(mp -> {
                                mp.getPushMessageManager().setPushToken(token);
                            });

                        });

                    } else {
                        Log.e(TAG, "Failed to retrieve FCM token.");
                    }
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Failed to retrieve InstanceId from Firebase.", e);
        }
    }
}
