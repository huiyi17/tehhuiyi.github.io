package com.example.grabngo.controllers;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.content.Intent;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import com.example.grabngo.R;

/** Function: For users to choose time slot for stall orders
 *  Input: String stallName (Intent extras) (setContentView to layout/choose_stall.xml)
 *  Output: String stallName, String timeSlot (Intent extras)
 *  Sent/Read from DB: None
 *  Prev Page Link: Vendorlogin.java
 *  Next Page Link: OrdersforSpecifiedTimePage.java
 *  Java Concepts/OOP: Intent
 */

public class VendorMainPage extends AppCompatActivity {
    ImageButton button1230PM;
    ImageButton button1PM;
    ImageButton button130PM;
    ImageButton button2PM;
    ImageView backarrow;

    TextView stallname;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main_vendor_page);

        String stall = getIntent().getStringExtra("stallName");

        stallname = (TextView) findViewById(R.id.VendorStoreName);
        button1230PM = (ImageButton) findViewById(R.id.Time1230PM);
        button1PM = (ImageButton) findViewById(R.id.Time1PM);
        button130PM  = (ImageButton) findViewById(R.id.Time130PM);
        button2PM  = (ImageButton) findViewById(R.id.Time2PM);
        backarrow = (ImageView) findViewById(R.id.BackArrowLogo);

        stallname.setText(stall + " Stall");

        backarrow.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent back = new Intent(VendorMainPage.this, ChooseStall.class);
                startActivity(back);
            }
        });

        button1230PM.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                Intent i = new Intent(VendorMainPage.this, OrdersforSpecifiedTimePage.class);
                i.putExtra("stallName", stall);
                i.putExtra("timeSlot", "12.30");
                startActivity(i);
            }
        });

        button1PM.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                Intent i = new Intent(VendorMainPage.this, OrdersforSpecifiedTimePage.class);
                i.putExtra("stallName", stall);
                i.putExtra("timeSlot", "1.00");
                startActivity(i);
            }
        });

        button130PM.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                Intent i = new Intent(VendorMainPage.this, OrdersforSpecifiedTimePage.class);
                i.putExtra("stallName", stall);
                i.putExtra("timeSlot", "1.30");
                startActivity(i);
            }
        });

        button2PM.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                Intent i = new Intent(VendorMainPage.this, OrdersforSpecifiedTimePage.class);
                i.putExtra("stallName", stall);
                i.putExtra("timeSlot", "2.00");
                startActivity(i);
            }
        });
    }
}
