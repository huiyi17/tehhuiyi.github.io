package com.example.grabngo.models;

import java.math.BigDecimal;
import java.util.ArrayList;

/**What the Order class do:
 * It is a singleton class, means that there can only be ONE instance of Order each time a user logins in
 * We append the food items with addFood(Food) object
*/
public class Order {

    private static Order instance = null;
    private ArrayList<Object> foodOrdered;
    private BigDecimal totalPrice;
    private int orderId;

    private String userId;

    private double timeSlot;

    private Order(){
        foodOrdered = new ArrayList<>();
        totalPrice = BigDecimal.ZERO;
        this.orderId = 0;
        this.userId = "";
        this.timeSlot = 0.0;
    }


    public static Order getInstance(){
        if (instance == null){
            instance = new Order();
        }
        return instance;
    }



    public void addFood(Object food){
        if (food instanceof ChickenRice) {
            ChickenRice subObj = (ChickenRice) food;
            foodOrdered.add(subObj);
            totalPrice = totalPrice.add(subObj.getNetPrice());
        }
        if (food instanceof Noodle) {
            Noodle subObj = (Noodle) food;
            foodOrdered.add(subObj);
            totalPrice = totalPrice.add(subObj.getNetPrice());
        }
    }

    public ArrayList<Object> getFoodOrdered() {return foodOrdered;}
    public void setFoodOrdered(ArrayList<Object> foodOrdered) {this.foodOrdered = foodOrdered;}
    public BigDecimal getTotalPrice() {return totalPrice.setScale(2,BigDecimal.ROUND_HALF_UP);}
    public void setTotalPrice(BigDecimal totalPrice) {this.totalPrice = totalPrice;}
    public int getOrderId() {return orderId;}
    public void setOrderId(int orderId) {this.orderId = orderId;}
    public String getUserId() {return userId;}
    public void setUserId(String userId) {this.userId = userId;}
    public double getTimeSlot() {return timeSlot;}
    public void setTimeSlot(double timeSlot) {this.timeSlot = timeSlot;}
    @Override
    public String toString(){
        String answer = "Order ID: " + getOrderId() +
                " \nUser ID: " + getUserId() +
                " \nTime Slot " + getTimeSlot() +
                " \nFood Ordered: " + getFoodOrdered().toString() +
                " \nTotal Price: " + getTotalPrice();
        return answer;
    }
}
