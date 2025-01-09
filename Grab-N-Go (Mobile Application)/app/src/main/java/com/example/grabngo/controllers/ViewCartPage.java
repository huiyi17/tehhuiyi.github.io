package com.example.grabngo.controllers;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.AppCompatButton;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.grabngo.R;
import com.example.grabngo.models.FirebaseDB;
import com.example.grabngo.models.Order;

/** Function: For users to view their cart
 *  Input: Order singleton instance (setContentView to layout/view_cart_page.xml)
 *  Output: None
 *  Sent/Read from DB: FirebaseDB.pushOrder(Order instance)
 *  Prev Page Link: ConfirmAddOnPage.java
 *  Next Page Link: OrderConfirmationPage.java
 *  Java Concepts/OOP: Intent, Singleton DP (Order)
 */

// TODO: Make the floats look prettier in xml (timeslot, price)
public class ViewCartPage extends AppCompatActivity {

    RecyclerView recyclerView;
    RecyclerView.Adapter myAdapter;
    RecyclerView.LayoutManager layoutManager;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.view_cart_page);
        Order ordermanagerv2 = Order.getInstance();

        // CHANGE VIEW TO REFLECT ORDER USING RECYCLERVIEW AND ORDER
        recyclerView = findViewById(R.id.List);
        layoutManager = new LinearLayoutManager(this);
        recyclerView.setLayoutManager(layoutManager);
        myAdapter = new OrderConfirmationPageAdapter(this, ordermanagerv2);
        recyclerView.setAdapter(myAdapter);

        TextView timeSlot = findViewById(R.id.PickUpTime);
        TextView totalPrice = findViewById(R.id.TotalPrice);
        timeSlot.setText("Pick up time: "+String.format("%.2f", ordermanagerv2.getTimeSlot())+"PM");
        totalPrice.setText(String.format("%.2f", ordermanagerv2.getTotalPrice()));

        AppCompatButton finalConfirm = findViewById(R.id.placeOrderButton);
        finalConfirm.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                FirebaseDB.pushOrder(ordermanagerv2);
                Intent finalcheck = new Intent(view.getContext(), OrderConfirmationPage.class);
                view.getContext().startActivity(finalcheck);
            }
        });
    }
}
