package com.stockmaster.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "location", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"warehouse_id", "name"}) // Matches the composite unique constraint in SQL
})
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Defines the Many-to-One relationship to the Warehouse table
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false) // Maps to the 'warehouse_id' FK column
    private Warehouse warehouse;

    @Column(name = "name", length = 150, nullable = false)
    private String name;

    @Column(name = "code", length = 50, nullable = false, unique = true)
    private String code;

    @Column(name = "location_type", length = 50, nullable = false)
    private String locationType = "STOCK"; // Default value

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

}