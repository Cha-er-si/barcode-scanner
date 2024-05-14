package chaersi.cordova.barcodescanner;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.content.pm.PackageManager;
import android.content.Intent;

import org.apache.cordova.CordovaPlugin;

import javax.security.auth.callback.Callback;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PermissionHelper;

// import com.google.zxing.client.android.CaptureActivity;
import chaersi.shaded.journeyapps.barcodescanner.CaptureActivity;
import chaersi.cordova.barcodescanner.CameraPreview.BarcodeScanInterface;
// import com.google.zxing.client.android.encode.EncodeActivity;
import com.google.zxing.client.android.Intents;

import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import android.widget.FrameLayout;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.common.BitMatrix;
import chaersi.shaded.journeyapps.barcodescanner.BarcodeEncoder;
import com.google.zxing.WriterException;
import android.view.View;
import android.view.ViewParent;
import android.view.ViewGroup;
import androidx.annotation.ColorInt;

/**
 * This class echoes a string called from JavaScript.
 */
public class ChaersiBarcodeScanner extends CordovaPlugin implements CameraPreview.BarcodeScanInterface {

    private static final String LOG_TAG = "BarcodeScanner";

    private String [] permissions = { Manifest.permission.CAMERA };

    private JSONArray requestArgs;
    private CallbackContext callbackContext;

    private CameraPreview cameraPreview;

    private CallbackContext startCameraCallback;
    private static final String STARTCAMERASCAN = "startCameraScan";
    private int containerViewId = 20;
    private ViewParent webViewParent;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if(action.equals(STARTCAMERASCAN)) {
            if(!hasPermisssion()) {
                requestPermissions(0);
            } else {
                startCameraScan(callbackContext);
            }
        } else {
            return false;
        }

        return true;
    }
    
    public void startCameraScan(CallbackContext callback) {
        this.startCameraCallback = callback;
        final float opacity = Float.parseFloat("1");
        cordova.getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                FrameLayout containerView = (FrameLayout) cordova.getActivity().findViewById(containerViewId);
        
                if(containerView == null){
                    containerView = new FrameLayout(cordova.getActivity().getApplicationContext());
                    containerView.setId(containerViewId);
        
                    FrameLayout.LayoutParams containerLayoutParams = new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT);
                    cordova.getActivity().addContentView(containerView, containerLayoutParams);
                }
                boolean toBack = true;
                if(toBack){
                    View view = webView.getView();
                    ViewParent rootParent = containerView.getParent();
                    ViewParent currentParent = view.getParent();

                    @ColorInt int color = 0x00000000;

                    view.setBackgroundColor(color);

                    if(currentParent.getParent() != rootParent){
                        while(currentParent != null && currentParent.getParent() != rootParent){
                            currentParent = currentParent.getParent();
                        }

                        if(currentParent != null){
                            ((ViewGroup)currentParent).setBackgroundColor(color);
                            ((ViewGroup)currentParent).bringToFront();
                        } else {
                            currentParent = view.getParent();
                            webViewParent = currentParent;
                            ((ViewGroup)view).bringToFront();
                        }
                    } else {
                        webViewParent = currentParent;
                        ((ViewGroup)currentParent).bringToFront();
                    }
                } else {
                    containerView.setAlpha(opacity);
                    containerView.bringToFront();
                }
        
                cameraPreview = new CameraPreview();
                cameraPreview.setEventListener(ChaersiBarcodeScanner.this);
                FragmentManager fragmentManager = cordova.getActivity().getSupportFragmentManager();
                FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
                fragmentTransaction.add(containerView.getId(), cameraPreview);
                fragmentTransaction.addToBackStack(null);
                fragmentTransaction.commit();
            }
        });
    }

    @Override
    public void onBarcodeScanned(String barcodeData) {
        Log.i("Scan Result", barcodeData);
        this.startCameraCallback.success(barcodeData);
    }

    public boolean hasPermisssion() {
        for(String p : permissions)
        {
            if(!PermissionHelper.hasPermission(this, p))
            {
                return false;
            }
        }
        return true;
    }

    public void requestPermissions(int requestCode) {
        PermissionHelper.requestPermissions(this, requestCode, permissions);
    }
    public void onRequestPermissionResult(int requestCode, String[] permissions, int[] grantResults) throws JSONException {
         PluginResult result;
         for (int r : grantResults) {
             if (r == PackageManager.PERMISSION_DENIED) {
                 Log.d(LOG_TAG, "Permission Denied!");
                 result = new PluginResult(PluginResult.Status.ILLEGAL_ACCESS_EXCEPTION);
                 this.callbackContext.sendPluginResult(result);
                 return;
             }
         }
  
         switch(requestCode)
         {
             case 0: 
                 startCameraScan(null);
                 break;
         }
     }
}
