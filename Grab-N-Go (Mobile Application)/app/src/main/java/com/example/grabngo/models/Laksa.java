package com.example.grabngo.models;

public class Laksa extends Noodle {
    public Laksa(LaksaBuilder laksaBuilder) {
        super(laksaBuilder);
        this.setFoodName("Laksa");
        this.setFoodId(5);
        this.setBasePrice(5.00);
    }

    static class LaksaBuilder extends NoodleBuilder {
        public Laksa build(){
            return new Laksa(this);
        }
    }
    @Override
    public void setFoodName(String foodName) {
        super.setFoodName(foodName);
    }

    @Override
    public String toString() {
        return "\nLaksa " +
                "\n Net price: " + this.getNetPrice() +
                "\n Add Noodle? " + this.isAddNoodle() +
                "\n Add Egg? " + this.isAddEgg() +
                "\n Add CheeseTofu? " + this.isAddCheeseTofu();
    }

}
