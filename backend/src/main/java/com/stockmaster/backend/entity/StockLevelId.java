package com.stockmaster.backend.entity;

import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class StockLevelId implements Serializable {

    private Integer productId;
    private Integer locationId;

    public StockLevelId() {
    }

    public StockLevelId(Integer productId, Integer locationId) {
        this.productId = productId;
        this.locationId = locationId;
    }

    // Getters and Setters (omitted for brevity, but should be present in a real-world scenario)
    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public Integer getLocationId() {
        return locationId;
    }

    public void setLocationId(Integer locationId) {
        this.locationId = locationId;
    }

    // equals and hashCode (essential for composite primary keys)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StockLevelId that = (StockLevelId) o;
        return productId.equals(that.productId) &&
               locationId.equals(that.locationId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(productId, locationId);
    }
}