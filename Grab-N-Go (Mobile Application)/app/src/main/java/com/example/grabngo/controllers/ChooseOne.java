package com.example.grabngo.controllers;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import com.example.grabngo.R;

/** Function: For users to choose to connect as Vendor or Customer
 *  Input: None (setContentView to layout/activity_choose_one.xml)
 *  Output: None
 *  Sent/Read from DB: None
 *  Prev Page Link: MainMenu.java
 *  Next Page Link: Vendorlogin/VendorRegistration/Customerlogin/CustomerRegistration.java
 *  Java Concepts/OOP: Intent
 */

public class ChooseOne extends AppCompatActivity {

    Button connectvendor_btn, connectcustomer_btn;
    Intent intent;
    String type;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_choose_one);

        intent = getIntent();
        type = intent.getStringExtra("Home").toString().trim();

        connectvendor_btn = (Button)findViewById(R.id.connectvendorbtn);
        connectcustomer_btn = (Button)findViewById(R.id.connectcustomerbtn);

        connectvendor_btn.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                if(type.equals("Email")) {
                    Intent loginwithemail_vendor = new Intent(ChooseOne.this, Vendorlogin.class);
                    startActivity(loginwithemail_vendor);
                    finish();
                }
                if (type.equals("SignUp")) {

                    Intent register_vendor = new Intent(ChooseOne.this, VendorRegistration.class);
                    startActivity(register_vendor);
                }
            }
        });

        connectcustomer_btn.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                if(type.equals("Email")) {
                    Intent loginwithemail_customer = new Intent(ChooseOne.this, Customerlogin.class);
                    startActivity(loginwithemail_customer);
                    finish();
                }
                if(type.equals("SignUp")) {
                    Intent register_customer = new Intent(ChooseOne.this, CustomerRegistration.class);
                    startActivity(register_customer);
                }
            }
        });
    }
}