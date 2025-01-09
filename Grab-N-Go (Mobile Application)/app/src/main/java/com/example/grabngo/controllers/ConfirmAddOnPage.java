package com.example.grabngo.controllers;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.Nullable;

import com.example.grabngo.R;
import com.example.grabngo.models.Order;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.ListIterator;

/** Function: For users to choose to add more items or view cart to confirm order
 *  Input: String foodName, String foodPrice, Boolean[] addOns, Order singleton instance (setContentView to layout/confirm_add_on_page.xml)
 *  Output: None
 *  Sent/Read from DB: None
 *  Prev Page Link: AddOnPage.java
 *  Next Page Link: ChooseStorePage/ViewCartPage.java
 *  Java Concepts/OOP: Intent
 */

public class ConfirmAddOnPage extends Activity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.confirm_add_on_page);

        String receivedName = getIntent().getStringExtra("foodName");
        String receivedPrice = getIntent().getStringExtra("foodPrice");
        boolean receivedAddons[] = getIntent().getBooleanArrayExtra("addOns");

        // DEBUGGING PURPOSES
        Order order = Order.getInstance();
        Log.d("ConfirmAddOnPage-onCreate", order.toString());

        // CHANGE VIEW TO REFLECT FOOD CHOICE
        TextView name = findViewById(R.id.FoodName);
        name.setText(receivedName);
        TextView price = findViewById(R.id.FoodPrice);
        price.setText(receivedPrice);

        // CHANGE VIEW TO REFLECT ADDONS + PRICES TIED TO FOOD
        TextView addon1Text = findViewById(R.id.AddOn1Final);
        TextView addon2Text = findViewById(R.id.AddOn2Final);
        TextView addon3Text = findViewById(R.id.AddOn3Final);
        TextView addon1Price = findViewById(R.id.AddOn1PriceFinal);
        TextView addon2Price = findViewById(R.id.AddOn2PriceFinal);
        TextView addon3Price = findViewById(R.id.AddOn3PriceFinal);
        ImageView confirm1Tick = findViewById(R.id.ConfirmedFinal1);
        ImageView confirm2Tick = findViewById(R.id.ConfirmedFinal2);
        ImageView confirm3Tick = findViewById(R.id.ConfirmedFinal3);

        switch (receivedName.replaceAll(" ", "")) {
            case "RoastedChickenRice" : case "SteamedWhiteChickenRice" : case "RoastedChickenRiceSetMeal" :
                addon1Text.setText("Meat");
                addon2Text.setText("Egg");
                addon3Text.setText("Tofu");
                addon1Price.setText(R.string.crmenu_addon_1_price);
                addon2Price.setText(R.string.crmenu_addon_2_price);
                addon3Price.setText(R.string.crmenu_addon_3_price);
                break;

            case "BanmianDryNoodle" : case "FishballNoodle" : case "Laksa" :
                addon1Text.setText("Noodle");
                addon2Text.setText("Egg");
                addon3Text.setText("Cheese Tofu");
                addon1Price.setText(R.string.bmmenu_addon_1_price);
                addon2Price.setText(R.string.bmmenu_addon_2_price);
                addon3Price.setText(R.string.bmmenu_addon_3_price);
                break;
        }

        for (int i = 0; i < receivedAddons.length; i++) {
            if (receivedAddons[i] == true) {
                switch(i) {
                    case 0:
                        confirm1Tick.setVisibility(View.VISIBLE);
                        break;
                    case 1:
                        confirm2Tick.setVisibility(View.VISIBLE);
                        break;
                    case 2:
                        confirm3Tick.setVisibility(View.VISIBLE);
                }
            }
        }

        // BUTTON HANDLING
        ImageButton continuebtn = (ImageButton) findViewById(R.id.ContinueShoppingTab);
        ImageButton confirmbtn = (ImageButton) findViewById(R.id.ViewCartTab);

        continuebtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent backChoose = new Intent(view.getContext(), ChooseStorePage.class);
                view.getContext().startActivity(backChoose);
            }
        });

        confirmbtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent nextCart = new Intent(view.getContext(), ViewCartPage.class);
                view.getContext().startActivity(nextCart);
            }
        });

    }
}
