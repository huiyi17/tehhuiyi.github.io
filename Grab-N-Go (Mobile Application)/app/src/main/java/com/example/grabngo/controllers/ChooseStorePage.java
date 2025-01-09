package com.example.grabngo.controllers;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import androidx.annotation.Nullable;
import androidx.cardview.widget.CardView;

import com.example.grabngo.R;
import com.example.grabngo.models.Order;

/** Function: For users to view stalls available to order from
 *  Input: Order singleton instance (setContentView to layout/choose_store_page.xml)
 *  Output: None
 *  Sent/Read from DB: None
 *  Prev Page Link: CustomerMainPage.java
 *  Next Page Link: CRStoreMenuPage/BMStoreMenuPage.java
 *  Java Concepts/OOP: Intent
 */

public class ChooseStorePage extends Activity {
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.choose_store_page);
        CardView store1 = findViewById(R.id.ChickenRiceStoreTab);
        CardView store2 = findViewById(R.id.BanmianStoreTab);

        // DEBUGGING PURPOSES
        Order order = Order.getInstance();
        Log.d("ChooseStorePage-onCreate", order.toString());

        store1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent chooseStore = new Intent(view.getContext(), CRStoreMenuPage.class);
                view.getContext().startActivity(chooseStore);
            }
        });

        store2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent chooseStore = new Intent(view.getContext(), BMStoreMenuPage.class);
                view.getContext().startActivity(chooseStore);
            }
        });

    }
}
