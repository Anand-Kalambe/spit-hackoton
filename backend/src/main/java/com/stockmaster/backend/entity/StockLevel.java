package com.stockmaster.backend.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "stock_level")
public class StockLevel {

    @EmbeddedId
    private StockLevelId id = new StockLevelId();

    @MapsId("productId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @MapsId("locationId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private Location location;

    @Column(name = "on_hand_quantity", precision = 10, scale = 3, nullable = false)
    private BigDecimal onHandQuantity = BigDecimal.ZERO;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();
    
    public StockLevel() {
    }

    // Helper constructor for easy initialization in service layer
    public StockLevel(Product product, Location location, BigDecimal quantity) {
        this.product = product;
        this.location = location;
        this.onHandQuantity = quantity;
        this.id = new StockLevelId(product.getId(), location.getId());
    }
}