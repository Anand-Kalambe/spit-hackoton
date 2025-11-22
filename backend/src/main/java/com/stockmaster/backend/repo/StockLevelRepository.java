package com.stockmaster.backend.repo;

import com.stockmaster.backend.entity.StockLevel;
import com.stockmaster.backend.entity.StockLevelId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;

public interface StockLevelRepository extends JpaRepository<StockLevel, StockLevelId> {

    // Custom method to check stock availability quickly
    Optional<StockLevel> findByProductIdAndLocationId(Integer productId, Integer locationId);

    // Custom query to find all low stock items (useful for dashboard KPI)
    List<StockLevel> findByOnHandQuantityLessThan(BigDecimal threshold);
}