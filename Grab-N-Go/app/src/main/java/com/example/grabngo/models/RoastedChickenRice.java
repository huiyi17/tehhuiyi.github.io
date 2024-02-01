package com.example.grabngo.models;

/** Details about RoastedChickenRice
 * It is a concrete class
 * The relationship with other classes is as follows Food <-- ChickenRice <-- SteamedChickenRice/RoastedChickenRice
 *  Notation: superclass <-- subclass
 */
public class RoastedChickenRice extends ChickenRice {
    public RoastedChickenRice(RoastedChickenRiceBuilder roastedChickenRiceBuilder) {
        super(roastedChickenRiceBuilder);
        this.setFoodName("Roasted Chicken Rice");
        this.setFoodId(2);
        this.setBasePrice(5.00);
    }

    public static class RoastedChickenRiceBuilder extends ChickenRiceBuilder {
        public RoastedChickenRice build(){
            return new RoastedChickenRice(this);
        }
    }
    @Override
    public void setFoodName(String foodName) {
        super.setFoodName(foodName);
    }

    @Override
    public String toString() {
        return "\nRoastedChickenRice " +
                "\n Net price: " + this.getNetPrice() +
                "\n Add meat? " + this.isAddMeat() +
                "\n Add Egg? " + this.isAddEgg() +
                "\n Add Tofu? " + this.isAddTofu();
    }

}
