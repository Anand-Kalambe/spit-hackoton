package com.stockmaster.backend.repository;

import com.stockmaster.backend.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    // You can add custom queries here if needed, e.g.:
    // Optional<Warehouse> findByCode(String code);
}