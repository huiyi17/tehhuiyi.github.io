package com.example.grabngo.models;


import java.util.HashMap;

/** Details about Food
 * No inputs or outputs
 * Attributes: foodName, foodId, basePrice, stallName
 * The relationship with other classes is as follows Food <-- ChickenRice <-- SteamedChickenRice/RoastedChickenRice
 * Notation: superclass <-- subclass
 * Concepts used: OOP abstract class
 */
public abstract class Food {

    // required parameters
    private String foodName;
    private int foodId;
    private double basePrice;
    private String stallName;

    private boolean isComplete;

    public Food(){}

    public Food(String foodName, int foodId, double basePrice, String stallName) {
        this.foodName = foodName;
        this.foodId = foodId;
        this.basePrice = basePrice;
        this.stallName = stallName;
        this.isComplete = false;
    }


    public String getFoodName() {return foodName;}

    public void setFoodName(String foodName) {this.foodName = foodName;}

    public int getFoodId() {return foodId;}

    public void setFoodId(int foodId) {this.foodId = foodId;}

    public double getBasePrice() {return basePrice;}

    public void setBasePrice(double basePrice) {this.basePrice = basePrice;}

    public String getStallName() {return stallName;}

    public void setStallName(String stallName) {this.stallName = stallName;}

    public boolean getIsComplete() {return isComplete;}

    public void setIsComplete(boolean status) {this.isComplete = status;}

}