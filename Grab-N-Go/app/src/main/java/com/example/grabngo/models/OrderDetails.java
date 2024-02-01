package com.example.grabngo.models;

public class OrderDetails {

    private String orderNumber;
    private String foodName;
    private Double foodPrice;
    private Boolean addMeat;
    private Boolean addEgg;
    private Boolean addTofu;

    private Boolean addCheeseTofu;
    private Boolean addNoodles;

    private Double totalPrice;

    public OrderDetails(String foodName, Double foodPrice, Boolean addMeat, Boolean addEgg,
                        Boolean addTofu, Boolean addCheeseTofu, Boolean addNoodles) {
        // this.orderNumber = orderNumber;
        this.foodName = foodName;
        this.foodPrice = foodPrice;
        this.addMeat = addMeat;
        this.addEgg = addEgg;
        this.addTofu = addTofu;
        this.addCheeseTofu = addCheeseTofu;
        this.addNoodles = addNoodles;
        // this.totalPrice = totalPrice;
    }

    /*** public String getOrderNumber() {
     return orderNumber;
     }

     public Double getTotalPrice() {
     return totalPrice;
     } */

    public String getfoodName() {
        return foodName;
    }

    public Double getfoodPrice() {
        return foodPrice;
    }

    public Boolean getaddMeat() {
        return addMeat;
    }

    public Boolean getaddEgg() {
        return addEgg;
    }

    public Boolean getaddTofu() {
        return addTofu;
    }

    public Boolean getaddCheeseTofu() {
        return addCheeseTofu;
    }
    public Boolean getaddNoodles() {
        return addNoodles;
    }
}


