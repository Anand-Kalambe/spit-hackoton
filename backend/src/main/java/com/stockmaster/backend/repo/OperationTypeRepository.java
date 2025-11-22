package com.stockmaster.backend.repo;


import com.stockmaster.backend.entity.OperationType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OperationTypeRepository extends JpaRepository<OperationType, Integer> {

    // Custom method to quickly find the necessary operation type by its unique code
    Optional<OperationType> findByCode(String code);
}