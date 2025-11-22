package com.stockmaster.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "stock_ledger_entry")
public class StockLedgerEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operation_id")
    private InventoryOperation operation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // Location the stock moved FROM (Source)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_location_id")
    private Location sourceLocation;

    // Location the stock moved TO (Destination)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_location_id")
    private Location destinationLocation;

    // CRUCIAL: Positive for incoming, Negative for outgoing (Delivery = negative)
    @Column(name = "quantity_change", precision = 10, scale = 3, nullable = false)
    private BigDecimal quantityChange;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uom_id", nullable = false)
    private UnitOfMeasure uom;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "transaction_date")
    private Instant transactionDate = Instant.now();

    @Column(name = "reference", length = 255)
    private String reference; // The operation_number
}