package com.example.grabngo.models;

public class DryNoodle extends Noodle {
    public DryNoodle(DryNoodleBuilder dryNoodleBuilder) {
        super(dryNoodleBuilder);
        this.setFoodName("Dry Noodle");
        this.setFoodId(4);
        this.setBasePrice(4.20);
    }

    public static class DryNoodleBuilder extends Noodle.NoodleBuilder {
        public DryNoodle build(){
            return new DryNoodle(this);
        }
    }
    @Override
    public void setFoodName(String foodName) {
        super.setFoodName(foodName);
    }

    @Override
    public String toString() {
        return "\nBanmianDryNoodle " +
                "\n Net price: " + this.getNetPrice() +
                "\n Add Noodle? " + this.isAddNoodle() +
                "\n Add Egg? " + this.isAddEgg() +
                "\n Add CheeseTofu? " + this.isAddCheeseTofu();
    }
}
