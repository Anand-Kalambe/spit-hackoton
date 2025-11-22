package com.stockmaster.backend.repo;

import com.stockmaster.backend.entity.InventoryOperation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryOperationRepository extends JpaRepository<InventoryOperation, Long> {

    // You can add custom queries here later, e.g., to fetch all 'Ready' deliveries for the dashboard
}