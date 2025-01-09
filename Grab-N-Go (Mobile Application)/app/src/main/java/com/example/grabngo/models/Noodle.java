package com.example.grabngo.models;

import java.math.BigDecimal;
import java.util.HashMap;

public class Noodle extends Food {
    // builder attributes
    private boolean isAddNoodle;
    private boolean isAddEgg;
    private boolean isAddCheeseTofu;

    private final double noodlePrice = 0.5;
    private final double eggPrice = 0.8;
    private final double cheeseTofuPrice = 0.6;

    private double netPrice;

    public BigDecimal getNetPrice() {
        netPrice = super.getBasePrice();
        if (this.isAddEgg()) {
            netPrice = netPrice + this.getEggPrice();
        }

        if (this.isAddCheeseTofu()) {
            netPrice = netPrice + this.getCheeseTofuPrice();
        }

        if (this.isAddNoodle()) {
            netPrice = netPrice + this.getNoodlePrice();
        }
        BigDecimal netPriceBD = new BigDecimal(netPrice);
        return netPriceBD.setScale(2, BigDecimal.ROUND_HALF_UP);
    }

    public double getNoodlePrice() {
        return noodlePrice;
    }

    public double getEggPrice() {
        return eggPrice;
    }

    public double getCheeseTofuPrice() {
        return cheeseTofuPrice;
    }

    public Noodle(NoodleBuilder noodleBuilder) {
        super("Noodle", 1, 4.20, "Noodles");
        this.isAddNoodle = noodleBuilder.isAddNoodle;
        this.isAddEgg = noodleBuilder.isAddEgg;
        this.isAddCheeseTofu = noodleBuilder.isAddCheeseTofu;
    }

    public boolean isAddNoodle() {
        return isAddNoodle;
    }

    public boolean isAddEgg() {
        return isAddEgg;
    }

    public boolean isAddCheeseTofu() {
        return isAddCheeseTofu;
    }

    public abstract static class NoodleBuilder {
        public NoodleBuilder() {
        }

        private boolean isAddNoodle;
        private boolean isAddEgg;
        private boolean isAddCheeseTofu;

        public NoodleBuilder setAddNoodle(boolean addNoodle) {
            this.isAddNoodle = addNoodle;
            return this;
        }

        public NoodleBuilder setAddEgg(boolean addEgg) {
            this.isAddEgg = addEgg;
            return this;
        }

        public NoodleBuilder setAddCheeseTofu(boolean addCheeseTofu) {
            this.isAddCheeseTofu = addCheeseTofu;
            return this;
        }

        public Noodle build() {
            return new Noodle(this);
        }
    }


    public HashMap<String, Object> getData() {
        HashMap<String, Object> packaged_data = new HashMap<>();

        packaged_data.put("food_name", this.getFoodName());
        packaged_data.put("food_id", this.getFoodId());
        packaged_data.put("food_price", this.getNetPrice().doubleValue());
        packaged_data.put("stall_name", this.getStallName());
        packaged_data.put("addNoodles", this.isAddNoodle());
        packaged_data.put("addEgg", this.isAddEgg());
        packaged_data.put("addCheeseTofu",  this.isAddCheeseTofu());
        packaged_data.put("isComplete", this.getIsComplete());

        return packaged_data;
    }

}
