package com.example.grabngo.models;

public class FishballNoodle extends Noodle {
    public FishballNoodle(FishballNoodleBuilder fishballNoodleBuilder) {
        super(fishballNoodleBuilder);
        this.setFoodName("Fishball Noodle");
        this.setFoodId(6);
        this.setBasePrice(2.70);
    }


    static class FishballNoodleBuilder extends Noodle.NoodleBuilder {
        public FishballNoodle build(){
            return new FishballNoodle(this);
        }
    }
    @Override
    public void setFoodName(String foodName) {
        super.setFoodName(foodName);
    }

    @Override
    public String toString() {
        return "\nFishball Noodle " +
                "\n Net price: " + this.getNetPrice() +
                "\n Add Noodle? " + this.isAddNoodle() +
                "\n Add Egg? " + this.isAddEgg() +
                "\n Add CheeseTofu? " + this.isAddCheeseTofu();
    }
}
