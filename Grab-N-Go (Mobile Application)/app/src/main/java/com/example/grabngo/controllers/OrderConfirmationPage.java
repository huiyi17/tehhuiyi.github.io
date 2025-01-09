package com.example.grabngo.controllers;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.grabngo.R;
import com.example.grabngo.models.Order;

/** Function: For showing final, confirmed order by user
 *  Input: Order singleton instance (setContentView to layout/order_confirmation_page.xml)
 *  Output: None
 *  Sent/Read from DB: None
 *  Prev Page Link: ViewCartPage.java
 *  Next Page Link: None
 *  Java Concepts/OOP: Intent, Singleton DP (Order)
 */

public class OrderConfirmationPage extends Activity {

    RecyclerView recyclerView;
    RecyclerView.Adapter myAdapter;
    RecyclerView.LayoutManager layoutManager;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.order_confirmation_page);
        Order ordermanagerv2 = Order.getInstance();

        // CHANGE VIEW TO REFLECT ORDER USING RECYCLERVIEW AND ORDER
        recyclerView = findViewById(R.id.List);
        layoutManager = new LinearLayoutManager(this);
        recyclerView.setLayoutManager(layoutManager);
        myAdapter = new OrderConfirmationPageAdapter(this, ordermanagerv2);
        recyclerView.setAdapter(myAdapter);

        TextView timeSlot = findViewById(R.id.PickUpTime);
        TextView totalPrice = findViewById(R.id.TotalPrice);
        timeSlot.setText("Pick up time: "+String.format("%.2f", ordermanagerv2.getTimeSlot()) + "PM");
        totalPrice.setText(String.format("%.2f", ordermanagerv2.getTotalPrice()));

        // FOR DEBUGGING PURPOSE
        Log.d("OrderConfirmation-onCreate", ordermanagerv2.toString());
    }
}

