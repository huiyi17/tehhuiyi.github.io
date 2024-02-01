package com.example.grabngo.models;

public class SteamedChickenRice extends ChickenRice {

    public SteamedChickenRice(SteamedChickenRiceBuilder steamedChickenRiceBuilder) {
        super(steamedChickenRiceBuilder);
        this.setFoodName("Steamed Chicken Rice");
        this.setFoodId(1);
        this.setBasePrice(5.00);
    }

    public static class SteamedChickenRiceBuilder extends ChickenRiceBuilder{
        public SteamedChickenRice build(){
            return new SteamedChickenRice(this);
        }
    }

    @Override
    public String toString() {
        return "\nSteamedChickenRice " +
                "\n Net price: " + this.getNetPrice() +
                "\n Add meat? " + this.isAddMeat() +
                "\n Add Egg? " + this.isAddEgg() +
                "\n Add Tofu? " + this.isAddTofu();
    }
}


