package com.example.grabngo.controllers;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.grabngo.R;
import com.example.grabngo.models.OrderDetails;

import java.util.List;

/** Function: Adapter for CompleteOrderPage
 *  Input: None (set Recyclerview to inflate layout/complete_order_page_item.xml)
 *  Output: None
 *  Sent/Read from DB: None
 *  Prev Page Link: None (Adapter)
 *  Next Page Link: None (Ditto above)
 *  Java Concepts/OOP: Adapter
 */

public class CompleteOrderPageAdapter extends RecyclerView.Adapter<CompleteOrderPageAdapter.CompletePageOrderViewHolder>{
    private List<OrderDetails> orderDetailsList;

    public CompleteOrderPageAdapter(List<OrderDetails> orderDetailsList) {
        this.orderDetailsList = orderDetailsList;
        Log.d("RecyclerView", "orderDetailsList size: " + orderDetailsList.size());
    }

    @NonNull
    @Override
    public CompletePageOrderViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.complete_order_page_item, parent, false);
        return new CompletePageOrderViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull CompleteOrderPageAdapter.CompletePageOrderViewHolder holder, int position) {
        OrderDetails orderDetails = orderDetailsList.get(position);
        holder.foodNameTextView.setText(orderDetails.getfoodName());
        Log.d("RecyclerView", "onCreateViewHolder" + orderDetails.getfoodName());

        // set basePrice <- for now...
        Double basePrice = 0.0;
        switch(orderDetails.getfoodName()) {
            case "Steamed Chicken Rice":
                basePrice = 5.00;
                break;
            case "Roasted Chicken Rice":
                basePrice = 5.00;
                break;
            case "Roasted Chicken Rice Set Meal":
                basePrice = 7.00;
                break;
            case "Dry Noodle":
                basePrice = 4.20;
                break;
            case "Laksa":
                basePrice = 5.00;
                break;
            case "Fishball Noodle":
                basePrice = 2.70;
                break;
        }

        holder.foodPriceTextView.setText("$" + String.format("%.2f", basePrice));
        Log.d("RecyclerView", "onCreateViewHolder" + orderDetails.getfoodName());

        if (orderDetails.getaddMeat() != null){
            if (orderDetails.getaddMeat()) {
                holder.addMeatTextView.setText("Add Meat");
                holder.addMeatTextView.setVisibility(View.VISIBLE);
                holder.addMeatPriceTextView.setText("$1.00");
            } else {
                holder.addMeatTextView.setVisibility(View.GONE);
                holder.addMeatPriceTextView.setVisibility(View.GONE);
            }
        } else{
            holder.addMeatTextView.setVisibility(View.GONE);
            holder.addMeatPriceTextView.setVisibility(View.GONE);
        }

        if (orderDetails.getaddEgg() != null){
            if (orderDetails.getaddEgg()) {
                holder.addEggTextView.setText("Add Egg");
                holder.addEggTextView.setVisibility(View.VISIBLE);
                holder.addEggPriceTextView.setText("$0.80");
            } else {
                holder.addEggTextView.setVisibility(View.GONE);
                holder.addEggPriceTextView.setVisibility(View.GONE);
            }
        } else{
            holder.addEggTextView.setVisibility(View.GONE);
            holder.addEggPriceTextView.setVisibility(View.GONE);
        }

        if (orderDetails.getaddTofu() != null){
            if (orderDetails.getaddTofu()) {
                holder.addTofuTextView.setText("Add Tofu");
                holder.addTofuTextView.setVisibility(View.VISIBLE);
                holder.addTofuPriceTextView.setText("$0.40");
            } else {
                holder.addTofuTextView.setVisibility(View.GONE);
                holder.addTofuPriceTextView.setVisibility(View.GONE);
            }
        } else {
            holder.addTofuTextView.setVisibility(View.GONE);
            holder.addTofuPriceTextView.setVisibility(View.GONE);
        }


        if (orderDetails.getaddCheeseTofu() != null){
            if (orderDetails.getaddCheeseTofu()) {
                holder.addCheeseTofuTextView.setText("Add CheeseTofu");
                holder.addCheeseTofuTextView.setVisibility(View.VISIBLE);
                holder.addCheeseTofuPriceTextView.setText("$0.60");
            } else {
                holder.addCheeseTofuTextView.setVisibility(View.GONE);
                holder.addCheeseTofuPriceTextView.setVisibility(View.GONE);
            }
        } else {
            holder.addCheeseTofuTextView.setVisibility(View.GONE);
            holder.addCheeseTofuPriceTextView.setVisibility(View.GONE);
        }

        if (orderDetails.getaddNoodles() != null){
            if (orderDetails.getaddNoodles()) {
                holder.addNoodlesTextView.setText("Add Noodles");
                holder.addNoodlesTextView.setVisibility(View.VISIBLE);
                holder.addNoodlesPriceTextView.setText("$0.50");
            } else {
                holder.addNoodlesTextView.setVisibility(View.GONE);
                holder.addNoodlesPriceTextView.setVisibility(View.GONE);
            }
        } else {
            holder.addNoodlesTextView.setVisibility(View.GONE);
            holder.addNoodlesPriceTextView.setVisibility(View.GONE);
        }
    }

    @Override
    public int getItemCount() {
        return orderDetailsList.size();
    }

    public class CompletePageOrderViewHolder extends RecyclerView.ViewHolder {
        TextView foodNameTextView;
        TextView foodPriceTextView;
        TextView addMeatTextView;
        TextView addMeatPriceTextView;
        TextView addEggTextView;
        TextView addEggPriceTextView;
        TextView addTofuTextView;
        TextView addTofuPriceTextView;
        TextView addCheeseTofuTextView;
        TextView addCheeseTofuPriceTextView;
        TextView addNoodlesTextView;
        TextView addNoodlesPriceTextView;

        // TextView totalPriceTextView;


        public CompletePageOrderViewHolder(View itemView) {
            super(itemView);
            foodNameTextView = itemView.findViewById(R.id.FoodName1);
            foodPriceTextView = itemView.findViewById(R.id.FoodPrice1);
            addMeatTextView = itemView.findViewById(R.id.AddOn1);
            addMeatPriceTextView = itemView.findViewById(R.id.AddOnPrice1);
            addEggTextView = itemView.findViewById(R.id.AddOn2);
            addEggPriceTextView = itemView.findViewById(R.id.AddOnPrice2);
            addTofuTextView = itemView.findViewById(R.id.AddOn3);
            addTofuPriceTextView = itemView.findViewById(R.id.AddOnPrice3);
            addCheeseTofuTextView = itemView.findViewById(R.id.AddOn4);
            addCheeseTofuPriceTextView = itemView.findViewById(R.id.AddOnPrice4);
            addNoodlesTextView = itemView.findViewById(R.id.AddOn5);
            addNoodlesPriceTextView = itemView.findViewById(R.id.AddOnPrice5);
        }
    }
}
