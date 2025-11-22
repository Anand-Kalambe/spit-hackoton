package com.stockmaster.backend.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;


@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", length = 255, nullable = false)
    private String name;

    @Column(name = "sku_code", length = 100, nullable = false, unique = true)
    private String skuCode;

    // Many-to-One relationship to ProductCategory
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id") // Maps to the 'category_id' FK column
    private ProductCategory category;

    // Many-to-One relationship to UnitOfMeasure
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uom_id", nullable = false) // Maps to the 'uom_id' FK column
    private UnitOfMeasure uom;

    @Column(name = "sale_price", precision = 10, scale = 2)
    private BigDecimal salePrice = BigDecimal.ZERO;

    @Column(name = "cost", precision = 10, scale = 2)
    private BigDecimal cost = BigDecimal.ZERO;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", updatable = false)
    private java.time.Instant createdAt = java.time.Instant.now();

    public Product() {}

    public Product(String name, String skuCode, ProductCategory category, UnitOfMeasure uom) {
        this.name = name;
        this.skuCode = skuCode;
        this.category = category;
        this.uom = uom;
    }
}