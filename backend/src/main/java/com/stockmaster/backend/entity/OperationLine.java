package com.stockmaster.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "operation_line", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"operation_id", "product_id"})
})
public class OperationLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operation_id", nullable = false)
    private InventoryOperation operation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uom_id", nullable = false)
    private UnitOfMeasure uom;

    // Quantity requested on the order (e.g., 10)
    @Column(name = "requested_quantity", precision = 10, scale = 3, nullable = false)
    private BigDecimal requestedQuantity;

    // Actual quantity processed/delivered (e.g., 8 were delivered, 2 backordered)
    @Column(name = "processed_quantity", precision = 10, scale = 3)
    private BigDecimal processedQuantity = BigDecimal.ZERO;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}