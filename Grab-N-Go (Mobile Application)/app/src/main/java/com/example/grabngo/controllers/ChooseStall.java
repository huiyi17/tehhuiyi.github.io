package com.example.grabngo.controllers;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;

import androidx.appcompat.widget.AppCompatButton;

import com.example.grabngo.R;

/** Function: For users to choose stall to view orders
 *  Input: None (setContentView to layout/choose_stall.xml)
 *  Output: String stallName (Intent extras)
 *  Sent/Read from DB: None
 *  Prev Page Link: Vendorlogin.java
 *  Next Page Link: VendorMainPage.java
 *  Java Concepts/OOP: Intent
 */

public class ChooseStall extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.choose_stall);

        AppCompatButton stall1 = (AppCompatButton) findViewById(R.id.chickenButton);
        AppCompatButton stall2 = (AppCompatButton) findViewById(R.id.banmianButton);
        ImageView backarrow = (ImageView) findViewById(R.id.BackArrowLogo);

        backarrow.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent back = new Intent(ChooseStall.this, VendorRegistration.class);
                startActivity(back);
            }
        });


        stall1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent chickenRiceStore = new Intent(ChooseStall.this, VendorMainPage.class);
                chickenRiceStore.putExtra("stallName", "Chicken Rice");
                startActivity(chickenRiceStore);
            }
        });
        stall2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent banMianStore = new Intent(ChooseStall.this, VendorMainPage.class);
                banMianStore.putExtra("stallName", "Noodles");
                startActivity(banMianStore);
            }
        });



    }
}