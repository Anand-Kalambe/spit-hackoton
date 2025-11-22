package com.stockmaster.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "operation_type")
public class OperationType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "code", length = 50, nullable = false, unique = true)
    private String code; // e.g., 'RECEIPT', 'DELIVERY', 'TRANSFER', 'ADJUSTMENT'

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}