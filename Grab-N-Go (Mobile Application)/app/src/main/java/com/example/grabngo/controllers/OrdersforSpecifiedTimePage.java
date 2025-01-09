package com.example.grabngo.controllers;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.content.Intent;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;

import androidx.annotation.NonNull;

import android.widget.ImageView;
import android.widget.TextView;

import androidx.cardview.widget.CardView;

import com.example.grabngo.R;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.Query;
import com.google.firebase.database.ValueEventListener;

/** Function: For users to view stall orders in specified timeslot
 *  Input: String stallName, String timeSlot (setContentView to layout/orders_for_specified_time_page.xml)
 *  Output: String id, String foodid, String totalprice, String stallName, String timeSlot
 *  Sent/Read from DB: DataSnapshot (retrieve order details including isComplete status to update view - greyed off)
 *  Prev Page Link: VendorMainPage.java
 *  Next Page Link: CompleteOrderPage.java
 *  Java Concepts/OOP: Intents
 */

public class OrdersforSpecifiedTimePage extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.orders_for_specified_time_page);

        String stall = getIntent().getStringExtra("stallName");
        String time = getIntent().getStringExtra("timeSlot");

        TextView stallNameText = findViewById(R.id.VendorStoreName);
        stallNameText.setText(stall);
        TextView timeSlotText = findViewById(R.id.TimeSlot);
        timeSlotText.setText("SLOT: " +time+" PM");

        FirebaseDatabase database = FirebaseDatabase.getInstance();
        DatabaseReference ordersRef = database.getReference("Order");

        TextView[] orderNameTextViews = new TextView[] {(TextView) findViewById(R.id.OrderName1), (TextView) findViewById(R.id.OrderName2), (TextView) findViewById(R.id.OrderName3), (TextView) findViewById(R.id.OrderName4), (TextView) findViewById(R.id.OrderName5), (TextView) findViewById(R.id.OrderName6), (TextView) findViewById(R.id.OrderName7), (TextView) findViewById(R.id.OrderName8), (TextView) findViewById(R.id.OrderName9), (TextView) findViewById(R.id.OrderName10)};
        TextView[] orderQuantityTextViews = new TextView[] {(TextView) findViewById(R.id.OrderQuantity1), (TextView) findViewById(R.id.OrderQuantity2), (TextView) findViewById(R.id.OrderQuantity3), (TextView) findViewById(R.id.OrderQuantity4), (TextView) findViewById(R.id.OrderQuantity5), (TextView) findViewById(R.id.OrderQuantity6), (TextView) findViewById(R.id.OrderQuantity7), (TextView) findViewById(R.id.OrderQuantity8), (TextView) findViewById(R.id.OrderQuantity9), (TextView) findViewById(R.id.OrderQuantity10)};
        TextView[] orderPriceTextViews = new TextView[] {(TextView) findViewById(R.id.OrderPrice1), (TextView) findViewById(R.id.OrderPrice2), (TextView) findViewById(R.id.OrderPrice3), (TextView) findViewById(R.id.OrderPrice4), (TextView) findViewById(R.id.OrderPrice5), (TextView) findViewById(R.id.OrderPrice6), (TextView) findViewById(R.id.OrderPrice7), (TextView) findViewById(R.id.OrderPrice8), (TextView) findViewById(R.id.OrderPrice9), (TextView) findViewById(R.id.OrderPrice10)};
        TextView[] orderAddOnTextViews = new TextView[] {(TextView) findViewById(R.id.OrderAddOn1), (TextView) findViewById(R.id.OrderAddOn2), (TextView) findViewById(R.id.OrderAddOn3), (TextView) findViewById(R.id.OrderAddOn4), (TextView) findViewById(R.id.OrderAddOn5), (TextView) findViewById(R.id.OrderAddOn6), (TextView) findViewById(R.id.OrderAddOn7), (TextView) findViewById(R.id.OrderAddOn8), (TextView) findViewById(R.id.OrderAddOn9), (TextView) findViewById(R.id.OrderAddOn10)};
        CardView[] orderCardViews = new CardView[] {(CardView) findViewById(R.id.OrderDetailsTab1), (CardView) findViewById(R.id.OrderDetailsTab2),(CardView) findViewById(R.id.OrderDetailsTab3),(CardView) findViewById(R.id.OrderDetailsTab4), (CardView) findViewById(R.id.OrderDetailsTab5),(CardView) findViewById(R.id.OrderDetailsTab6),(CardView) findViewById(R.id.OrderDetailsTab7),(CardView) findViewById(R.id.OrderDetailsTab8),(CardView) findViewById(R.id.OrderDetailsTab9),(CardView) findViewById(R.id.OrderDetailsTab10)};

        ImageView backarrow = (ImageView) findViewById(R.id.BackArrowLogo);

        backarrow.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent back = new Intent(OrdersforSpecifiedTimePage.this, VendorMainPage.class);
                startActivity(back);
            }
        });
        String orderid = getIntent().getStringExtra("id");   //addoncode

        Query query = ordersRef.orderByChild("timeslot").equalTo(time);
        query.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                // Loop through the orders in the "orders" node
                int i = 1;
                int count = 0;
                for (DataSnapshot orderSnapshot : dataSnapshot.getChildren()) {
                    // Get the order details
                    String orderId = orderSnapshot.getKey();
                    String orderPrice = String.format("%.2f", orderSnapshot.child("total_price").getValue(double.class));
                    for (DataSnapshot foodSnapshot : orderSnapshot.child("list_of_food").getChildren()) {
                        String foodId = foodSnapshot.getKey();
                        Boolean isCompleted = foodSnapshot.child("isComplete").getValue(Boolean.class);
                        String stall_name = foodSnapshot.child("stall_name").getValue(String.class);
                        String food_name = foodSnapshot.child("food_name").getValue(String.class);

                        String addons = "";
                        if (stall_name.equals(stall)) {
                            count++;
                            if (stall_name.equals("Chicken Rice")) {

                                Boolean isAddMeat = foodSnapshot.child("addMeat").getValue(Boolean.class);
                                Boolean isAddEgg = foodSnapshot.child("addEgg").getValue(Boolean.class);
                                Boolean isAddTofu = foodSnapshot.child("addTofu").getValue(Boolean.class);

                                if (isAddMeat) {
                                    addons += "add meat\n";
                                }
                                if (isAddEgg) {
                                    addons += "add egg\n";
                                }
                                if (isAddTofu) {
                                    addons += "add tofu\n";
                                }


                            } else if (stall_name.equals("Noodles")) {

                                Boolean isAddNoodles = foodSnapshot.child("addNoodles").getValue(Boolean.class);
                                Boolean isAddEgg = foodSnapshot.child("addEgg").getValue(Boolean.class);
                                Boolean isAddCheeseTofu = foodSnapshot.child("addCheeseTofu").getValue(Boolean.class);

                                if (isAddNoodles) {
                                    addons += "add noodles\n";
                                }
                                if (isAddEgg) {
                                    addons += "add egg\n";
                                }
                                if (isAddCheeseTofu) {
                                    addons += "add cheese tofu\n";
                                }
                            }

                            // Update the corresponding TextView with the order details
                            TextView orderNameTextView = orderNameTextViews[i - 1];
                            orderNameTextView.setText(food_name);
                            TextView orderPriceTextView = orderPriceTextViews[i - 1];
                            orderPriceTextView.setText("$" + orderPrice);
                            TextView orderQuantityTextView = orderQuantityTextViews[i - 1];
                            orderQuantityTextView.setText("x 1");
                            CardView orderCardView = orderCardViews[i - 1];
                            TextView orderAddOnTextView = orderAddOnTextViews[i - 1];
                            orderAddOnTextView.setText(addons);

                            if (isCompleted) {
                                count--;
                                // Set background color to grey
                                orderCardView.setCardBackgroundColor(Color.DKGRAY);
                                orderNameTextView.setTextColor(Color.TRANSPARENT);
                                orderQuantityTextView.setTextColor(Color.TRANSPARENT);
                                orderAddOnTextView.setTextColor(Color.TRANSPARENT);
                                orderPriceTextView.setTextColor(Color.TRANSPARENT);
                                orderCardView.setOnClickListener(null);
                            } else {
                                orderCardView.setOnClickListener(new OnClickListener() {
                                    @Override
                                    public void onClick(View view) {
                                        Intent intent = new Intent(OrdersforSpecifiedTimePage.this, CompleteOrderPage.class);
                                        intent.putExtra("id", orderId);
                                        intent.putExtra("foodid", foodId);
                                        intent.putExtra("totalprice", orderPrice);
                                        intent.putExtra("stallName", stall);
                                        intent.putExtra("timeSlot", time);
                                        startActivity(intent);
                                    }
                                });
                            }
                            // Increment i for the next order
                            i++;
                        }
                        TextView ordersCountTextView = (TextView) findViewById(R.id.NumberofOrders);
                        ordersCountTextView.setText(String.valueOf("TOTAL ORDERS: " + count)); // set the value to the UI

                    }
                }
            }
            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                Log.e("Firebase", "Error retrieving orders", databaseError.toException());
            }
        });






    }
}
