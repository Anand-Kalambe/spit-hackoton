package com.stockmaster.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "internal_transfer")
public class InternalTransfer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "from_warehouse_id", nullable = false)
    private Warehouse from;

    @ManyToOne
    @JoinColumn(name = "to_warehouse_id", nullable = false)
    private Warehouse to;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransferStatus status;

    public InternalTransfer() {}

    public InternalTransfer(Warehouse from, Warehouse to, TransferStatus status) {
        this.from = from;
        this.to = to;
        this.status = status;
    }
}
