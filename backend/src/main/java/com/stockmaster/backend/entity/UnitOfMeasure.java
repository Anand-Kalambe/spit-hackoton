package com.stockmaster.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "unit_of_measure")
public class UnitOfMeasure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", length = 50, nullable = false, unique = true)
    private String name;

    @Column(name = "symbol", length = 10, nullable = false, unique = true)
    private String symbol;

    public UnitOfMeasure() {

    }

    public UnitOfMeasure(String name, String symbol) {
        this.name = name;
        this.symbol = symbol;
    }
}