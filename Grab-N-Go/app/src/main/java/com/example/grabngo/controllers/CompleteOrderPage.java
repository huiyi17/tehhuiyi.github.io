package com.example.grabngo.controllers;

import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.grabngo.R;
import com.example.grabngo.models.ChickenRice;
import com.example.grabngo.models.OrderDetails;
import com.example.grabngo.models.SteamedChickenRice;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.List;

/** Function: For users to view order details and mark as complete
 *  Input: String id, String foodid, String stallName, String timeSlot (setContentView to layout/complete_order_page.xml)
 *  Output: String stallName, String timeSlot (Intent extras)
 *  Sent/Read from DB: DataSnapshot (set isComplete to true and retrieve order details)
 *  Prev Page Link: OrdersforSpecifiedTimePage.java
 *  Next Page Link: OrdersforSpecifiedTimePage.java
 *  Java Concepts/OOP: Intent
 */

public class CompleteOrderPage extends Activity {
    private List<OrderDetails> orderDetailsList;
    private CompleteOrderPageAdapter adapter;
    private RecyclerView recyclerView;
    double price;


    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.complete_order_page);

        Button completeOrderButton = findViewById(R.id.ProceedButton);
        String orderId = getIntent().getStringExtra("id");
        String foodId = getIntent().getStringExtra("foodid");
        String stall = getIntent().getStringExtra("stallName");
        String time = getIntent().getStringExtra("timeSlot");

        orderDetailsList = new ArrayList<>();
        Log.d("CompleteOrderPage", "orderDetailsList initialized");

        // initialize RecyclerView and its adapter
        recyclerView = findViewById(R.id.recycler_view_complete_order_page);
        adapter = new CompleteOrderPageAdapter(orderDetailsList);

        Log.d("CompleteOrderPage", "recyclerView = " + recyclerView);
        // Set up the RecyclerView
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setAdapter(adapter);

        ImageView backarrow = (ImageView) findViewById(R.id.BackArrowLogo);

        backarrow.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent back = new Intent(CompleteOrderPage.this, OrdersforSpecifiedTimePage.class);
                startActivity(back);
            }
        });

        FirebaseDatabase database = FirebaseDatabase.getInstance();
        DatabaseReference ordersRef = database.getReference("Order");
        DatabaseReference orderIdRef = ordersRef.child(orderId);
        DatabaseReference foodsRef = orderIdRef.child("list_of_food");
        DatabaseReference foodIdRef = foodsRef.child(foodId);
        Log.d("orderid", "onDataChange: " + orderId);

        orderIdRef.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                Log.d("childCount", "onDataChange: " + dataSnapshot);
                Log.d("childCount", "onDataChange: " + dataSnapshot.child("list_of_food"));

                String orderNumber = orderId.substring(5);
                Log.d("ordernumber", "onDataChange: " + orderNumber);
                TextView orderNumberTextView = findViewById(R.id.OrderNumber);
                orderNumberTextView.setText("Order # " + orderNumber);

                Log.d("childCount", "onDataChange: " + dataSnapshot.child("list_of_food").getChildrenCount());
                for (DataSnapshot foodNumberSnapshot : dataSnapshot.child("list_of_food").getChildren()) {
                    String stallName = foodNumberSnapshot.child("stall_name").getValue(String.class); // Retrieve stall_name from Firebase
                    if (stallName.equals(stall)) {
                        String foodName = foodNumberSnapshot.child("food_name").getValue(String.class);
                        Log.d("foodname", "onDataChange: " + foodName);

                        Double foodPrice = foodNumberSnapshot.child("food_price").getValue(Double.class);
                        Log.d("netprice", "onDataChange: " + foodPrice);

                        if (stallName.equals(stall)) {

                            // get addMeat
                            Boolean addMeat = foodNumberSnapshot.child("addMeat").getValue(Boolean.class);
                            if (addMeat != null) {
                                Log.d("isAddMeat", "onDataChange: " + addMeat);
                            } else {
                                Log.d("isAddMeat", "onDataChange: addMeat is null");
                            }

                            // get addEgg
                            Boolean addEgg = foodNumberSnapshot.child("addEgg").getValue(Boolean.class);
                            if (addEgg != null) {
                                Log.d("isAddEgg", "onDataChange: " + addEgg);
                            } else {
                                Log.d("isAddEgg", "onDataChange: addEgg is null");
                            }

                            // get addTofu
                            Boolean addTofu = foodNumberSnapshot.child("addTofu").getValue(Boolean.class);
                            if (addTofu != null) {
                                Log.d("isAddTofu", "onDataChange: " + addTofu);
                            } else {
                                Log.d("isAddTofu", "onDataChange: addTofu is null");
                            }


                            // get addCheeseTofu
                            Boolean addCheeseTofu = foodNumberSnapshot.child("addCheeseTofu").getValue(Boolean.class);
                            if (addCheeseTofu != null) {
                                Log.d("isAddMeat", "onDataChange: " + addCheeseTofu);
                            } else {
                                Log.d("isAddCheeseTofu", "onDataChange: addCheeseTofu is null");
                            }

                            // get addNoodles
                            Boolean addNoodles = foodNumberSnapshot.child("addNoodles").getValue(Boolean.class);
                            if (addNoodles != null) {
                                Log.d("isAddNoodles", "onDataChange: " + addNoodles);
                            } else {
                                Log.d("isAddNoodles ", "onDataChange: addNoodles  is null");
                            }

                            OrderDetails orderDetails = new OrderDetails(foodName, foodPrice, addMeat, addEgg, addTofu, addCheeseTofu, addNoodles);
                            orderDetailsList.add(orderDetails);

                        }
                        // get totalPrice
                        TextView totalPriceTextView = findViewById(R.id.TotalPrice);
                        totalPriceTextView.setText("$ " + String.format("%.2f", foodPrice));
                        Log.d("totalprice", "onDataChange: " + price);
                    }
                }
            }
            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.e("Firebase", "Error retrieving orders", error.toException());
            };
        });
        completeOrderButton.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                //change the value of open_order to be false
                foodIdRef.child("isComplete").setValue(true);
                Intent i = new Intent(CompleteOrderPage.this, OrdersforSpecifiedTimePage.class);
                i.putExtra("stallName", stall);
                i.putExtra("timeSlot", time);
                startActivity(i);

            }
        });
    }
}
