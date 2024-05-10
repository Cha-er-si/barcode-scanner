package chaersi.cordova.barcodescanner;

import android.app.Activity;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import chaersi.shaded.zxing.ResultPoint;
import chaersi.shaded.journeyapps.barcodescanner.BarcodeCallback;
import chaersi.shaded.journeyapps.barcodescanner.BarcodeResult;
import chaersi.shaded.journeyapps.barcodescanner.CaptureManager;
import chaersi.shaded.journeyapps.barcodescanner.DecoratedBarcodeView;

import java.util.List;

public class CameraPreview extends Fragment {
    public interface BarcodeScanInterface {
        void onBarcodeScanned(String barcodeData);
    }
    private CaptureManager capture;
    private DecoratedBarcodeView barcodeScannerView;
    private String appResourcePackage;

    private BarcodeScanInterface barcodeScanListener;
    public void setEventListener(BarcodeScanInterface listener){
        barcodeScanListener = listener;
    }


    public CameraPreview() {
    }
    
    public static CameraPreview newInstance() {
        CameraPreview fragment = new CameraPreview();
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        appResourcePackage = getActivity().getPackageName();
        View rootView = inflater.inflate(getResources().getIdentifier("activity_camera", "layout", appResourcePackage), container, false);
        barcodeScannerView = rootView.findViewById(chaersi.shaded.zxing.client.android.R.id.zxing_barcode_scanner);
        barcodeScannerView.initializeFromIntent(getActivity().getIntent());
        barcodeScannerView.setStatusText("");
        capture = new CaptureManager(getActivity(), barcodeScannerView);
        capture.initializeFromIntent(getActivity().getIntent(), savedInstanceState);
        barcodeScannerView.decodeSingle(new BarcodeCallback() {
            @Override
            public void barcodeResult(BarcodeResult result) {
                if(result != null) {
                    handleBarcodeResult(result);
                }
            }

            @Override
            public void possibleResultPoints(List<ResultPoint> resultPoints) {
            }
        });

        return rootView;
    }

    private void handleBarcodeResult(BarcodeResult result) {
        barcodeScannerView.pause();
        barcodeScanListener.onBarcodeScanned(result.getText());

        // Activity activity = getActivity();
        // if (activity instanceof BarcodeScanInterface) {
        //     ((BarcodeScanInterface)activity).onBarcodeScanned(result.getText());
        // }
    }

    @Override
    public void onResume() {
        super.onResume();
        capture.onResume();
    }

    @Override
    public void onPause() {
        super.onPause();
        capture.onPause();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        capture.onDestroy();
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        capture.onSaveInstanceState(outState);
    }
}