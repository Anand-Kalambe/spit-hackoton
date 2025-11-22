package com.stockmaster.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "inventory_operation")
public class InventoryOperation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Use Long for primary key of transactional tables

    @Column(name = "operation_number", length = 100, nullable = false, unique = true)
    private String operationNumber; // e.g., WH/OUT/0001

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operation_type_id", nullable = false)
    private OperationType operationType;

    @Column(name = "status", length = 50, nullable = false)
    private String status; // Draft, Waiting, Ready, Done, Canceled

    // Source location (where stock leaves from - required for Delivery)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_location_id")
    private Location sourceLocation;

    // Destination location (where stock arrives - optional for Delivery, usually a virtual 'Customer' location)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_location_id")
    private Location destinationLocation;

    @Column(name = "scheduled_date")
    private LocalDate scheduledDate;

    @Column(name = "validated_at")
    private Instant validatedAt;

    // Assuming a User entity will be created later (for now, use a simple Integer/Long FK)
    @Column(name = "responsible_user_id")
    private Long responsibleUserId;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();
}