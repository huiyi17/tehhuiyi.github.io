package com.example.grabngo.models;

/** Details about RoastedChickenRice
 * It is a concrete class
 * The relationship with other classes is as follows Food <-- ChickenRice <-- SteamedChickenRice/RoastedChickenRice
 *  Notation: superclass <-- subclass
 */
public class RoastedChickenRiceSetMeal extends ChickenRice {
    public RoastedChickenRiceSetMeal(RoastedChickenRiceSetMealBuilder roastedChickenRiceSetMealBuilder) {
        super(roastedChickenRiceSetMealBuilder);
        this.setFoodName("Roasted Chicken Rice Set Meal");
        this.setFoodId(3);
        this.setBasePrice(7.00);
    }

    public static class RoastedChickenRiceSetMealBuilder extends ChickenRiceBuilder {
        public RoastedChickenRiceSetMeal build(){
            return new RoastedChickenRiceSetMeal(this);
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
