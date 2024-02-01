package com.example.grabngo.models;

import android.util.Log;

import com.example.grabngo.models.ChickenRice;
import com.example.grabngo.models.Noodle;
import com.example.grabngo.models.Order;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;


import java.util.HashMap;

/** Function: For communicating with Firebase database
 *  Input: Order singleton instance
 *  Output: None
 *  Sent/Read from DB: DatabaseReference.setValue (pushOrder sends Order to DB)
 *  Prev Page Link: None
 *  Next Page Link: None
 *  Java Concepts/OOP: None
 */

public class FirebaseDB {
    private static DatabaseReference mDatabase = FirebaseDatabase.getInstance().getReference();

    public static void testOrder(Order order) {
        Log.d("Time Slot", String.valueOf(order.getTimeSlot()));
        Log.d("User ID", String.valueOf(order.getUserId()));
        Log.d("Total Price", String.valueOf(order.getTotalPrice().floatValue()));

        for (int i = 0; i < order.getFoodOrdered().size(); i++) {
            Object food_item = order.getFoodOrdered().get(i);

            Log.d("Food Name", food_item.toString() + "\n");
        }
    }

    public static void pushOrder(Order order) {
        HashMap<String, Object> remaining_data = new HashMap<>();
        remaining_data.put("timeslot", String.format("%.2f", order.getTimeSlot()));
        remaining_data.put("user_id", order.getUserId());
        remaining_data.put("total_price", order.getTotalPrice().doubleValue());

        if (order.getOrderId() == 0) {
            mDatabase.child("Order").child("order1").setValue(remaining_data);
        } else {
            mDatabase.child("Order").child("order" + order.getOrderId()).setValue(remaining_data);
        }

        for (int i = 0; i < order.getFoodOrdered().size(); i++) {
            Object food_item = order.getFoodOrdered().get(i);

            if (order.getOrderId() == 0) {
                if (food_item instanceof Noodle) {
                    mDatabase.child("Order").child("order1").child("list_of_food").child("food"+i).setValue(((Noodle) food_item).getData());
                } else if (food_item instanceof ChickenRice) {
                    mDatabase.child("Order").child("order1").child("list_of_food").child("food"+i).setValue(((ChickenRice) food_item).getData());
                }
            } else {
                if (food_item instanceof Noodle) {
                    mDatabase.child("Order").child("order" + order.getOrderId()).child("list_of_food").child("food" + i).setValue(((Noodle) food_item).getData());
                } else if (food_item instanceof ChickenRice) {
                    mDatabase.child("Order").child("order" + order.getOrderId()).child("list_of_food").child("food" + i).setValue(((ChickenRice) food_item).getData());
                }
            }
        }
    }
}
