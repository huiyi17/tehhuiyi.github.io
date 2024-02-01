package com.example.grabngo.controllers;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;

import com.example.grabngo.R;
import com.example.grabngo.models.Order;

/** Function: For users to choose timeslot for order
 *  Input: Order singleton instance (setContentView to layout/main_customer_page.xml)
 *  Output: None (sets Order.setTimeSlot)
 *  Sent/Read from DB: None
 *  Prev Page Link: Customerlogin.java
 *  Next Page Link: ChooseStorePage.java
 *  Java Concepts/OOP: Intent, Singleton DP (Order)
 */

public class CustomerMainPage extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main_customer_page);

        // Detect on-click events in popup and redirect accordingly (hardcoded)
        ImageButton timeslot1 = (ImageButton) findViewById(R.id.Time1230PM);
        ImageButton timeslot2 = (ImageButton) findViewById(R.id.Time1PM);
        ImageButton timeslot3 = (ImageButton) findViewById(R.id.Time130PM);
        ImageButton timeslot4 = (ImageButton) findViewById(R.id.Time2PM);
        Order ordermanagerv2 = Order.getInstance();

        timeslot1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                ordermanagerv2.setTimeSlot(12.30);
                Intent choose_store = new Intent(view.getContext(), ChooseStorePage.class);
                view.getContext().startActivity(choose_store);
            }
        });

        timeslot2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                ordermanagerv2.setTimeSlot(1.00);
                Intent choose_store = new Intent(view.getContext(), ChooseStorePage.class);
                view.getContext().startActivity(choose_store);
            }
        });

        timeslot3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                ordermanagerv2.setTimeSlot(1.30);
                Intent choose_store = new Intent(view.getContext(), ChooseStorePage.class);
                view.getContext().startActivity(choose_store);
            }
        });

        timeslot4.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                ordermanagerv2.setTimeSlot(2.00);
                Intent choose_store = new Intent(view.getContext(), ChooseStorePage.class);
                view.getContext().startActivity(choose_store);
            }
        });
    }
}
