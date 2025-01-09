package com.example.grabngo.test;

public class TestOrder {
    /**
    public static void main(String[] args) {
        ChickenRice steamed1 = new SteamedChickenRice.SteamedChickenRiceBuilder().setAddEgg(false).setAddTofu(true).setAddMeat(false).build();
        ChickenRice roasted1 = new RoastedChickenRice.RoastedChickenRiceBuilder().setAddEgg(true).setAddTofu(false).setAddMeat(false).build();
        Noodle drybanmian = new DryNoodle.DryNoodleBuilder().setAddEgg(true).setAddNoodle(true).setAddCheeseTofu(true).build();

        Order order1 = new Order(1,1,12.0);
        order1.addOrder(steamed1);
        System.out.println("steamed1 price" + order1.getTotalPrice());
        for (Object item : order1.getFoodOrdered()) {
            if (item instanceof ChickenRice) {
                ChickenRice subObj = (ChickenRice) item;
                System.out.println(subObj.getFoodName() + "     " + subObj.getNetPrice());
                System.out.println(subObj.isAddEgg());
            }
        }

        System.out.println("------------------------------------------");

        order1.addOrder(roasted1);
        System.out.println("steamed1 + roasted1 price" + order1.getTotalPrice());
        for (Object item : order1.getFoodOrdered()) {
            if (item instanceof ChickenRice) {
                ChickenRice subObj = (ChickenRice) item;
                System.out.println(subObj.getFoodName() + "     " + subObj.getNetPrice());
                System.out.println("add egg? : " + subObj.isAddEgg());
            }
        }

        System.out.println("-------------------------------------------");

        order1.addOrder(drybanmian);
        System.out.println("total price" + order1.getTotalPrice());
        for (Object item : order1.getFoodOrdered()) {
            if (item instanceof ChickenRice) {
                ChickenRice subObj = (ChickenRice) item;
                System.out.println(subObj.getFoodName() + "     " + subObj.getNetPrice());
                System.out.println("add tofu? : " + subObj.isAddTofu());
            }
            if (item instanceof Noodle) {
                Noodle subObj = (Noodle) item;
                System.out.println(subObj.getFoodName() + "     " + subObj.getNetPrice());
                System.out.println("add noodle? : " + subObj.isAddNoodle());
            }
        }
    }

     **/
}
