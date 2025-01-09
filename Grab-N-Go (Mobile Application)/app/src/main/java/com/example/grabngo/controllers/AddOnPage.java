package com.example.grabngo.controllers;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.widget.AppCompatButton;

import com.example.grabngo.R;
import com.example.grabngo.models.FoodFactory;
import com.example.grabngo.models.Food;
import com.example.grabngo.models.Order;

/** Function: For users to choose add-ons to food
 *  Input: String foodName, String foodPrice, Order singleton instance, Food factory and builder (setContentView to layout/add_on_page.xml)
 *  Output: None (append Food objects from factory and builder into Order.foodOrdered)
 *  Sent/Read from DB: None
 *  Prev Page Link: CRStoreMenuPage/BMStoreMenuPage.java
 *  Next Page Link: ConfirmAddOnPage.java
 *  Java Concepts/OOP: Intent, Singleton DP (Order),
 *                             Factory DP (Food :
 *                                         ChickenRice <- SteamedChickenRice/RoastedChickenRice/RoastedChickenRiceSetMeal
 *                                         Noodle <- DryNoodle/Laksa/FishballNoodle)
 *                             Builder DP (ChickenRiceBuilder <- SteamedChickenRiceBuilder/RoastedChickenRiceBuilder/RoastedChickenRiceSetMealBuilder
 *                                         NoodleBuilder <- DryNoodleBuilder/LaksaBuilder/FishballNoodleBuilder)
 */

public class AddOnPage extends Activity {
    private boolean addon1;
    private boolean addon2;
    private boolean addon3;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.add_on_page);

        String receivedName = getIntent().getStringExtra("foodName");
        String receivedPrice = getIntent().getStringExtra("foodPrice");

        // DEBUGGING PURPOSES
        Order order = Order.getInstance();
        Log.d("AddonPage-onCreate", order.toString());

        // CHANGE VIEW TO REFLECT FOOD CHOICE
        TextView name = findViewById(R.id.FoodName);
        name.setText(receivedName);
        TextView price = findViewById(R.id.FoodPrice);
        price.setText(receivedPrice);

        // CHANGE VIEW TO REFLECT ADDONS + PRICES TIED TO FOOD
        TextView addon1Text = findViewById(R.id.AddOn1);
        TextView addon2Text = findViewById(R.id.AddOn2);
        TextView addon3Text = findViewById(R.id.AddOn3);
        TextView addon1Price = findViewById(R.id.AddOn1Price);
        TextView addon2Price = findViewById(R.id.AddOn2Price);
        TextView addon3Price = findViewById(R.id.AddOn3Price);

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

        // CHECKBOX HANDLING
        CheckBox addonCheckBox1 = findViewById(R.id.AddOn1CheckBox);
        CheckBox addonCheckBox2 = findViewById(R.id.AddOn2CheckBox);
        CheckBox addonCheckBox3 = findViewById(R.id.AddOn3CheckBox);
        addon1 = addonCheckBox1.isChecked();
        addon2 = addonCheckBox2.isChecked();
        addon3 = addonCheckBox3.isChecked();

        AppCompatButton proceedbtn = findViewById(R.id.AddOnProceed);

        addonCheckBox1.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                addon1 = b;
            }
        });

        addonCheckBox2.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                addon2 = b;
            }
        });

        addonCheckBox3.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                addon3 = b;
            }
        });

        proceedbtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Add Food to Order
                Order order = Order.getInstance();
                Food food = FoodFactory.createFoodWithAddOns(receivedName.replaceAll(" ", ""), addon1, addon2, addon3);
                order.addFood(food);

                // DEBUGGING PURPOSES
                Log.d("Order", order.toString());

                // Pass data only for changing page layout (NOT firebase database)
                boolean addonOptions[] = {addon1, addon2, addon3};
                Intent nextAdd = new Intent(view.getContext(), ConfirmAddOnPage.class);
                nextAdd.putExtra("foodName", receivedName);
                nextAdd.putExtra("foodPrice", receivedPrice);
                nextAdd.putExtra("addOns", addonOptions);
                view.getContext().startActivity(nextAdd);
            }
        });
    }
}
