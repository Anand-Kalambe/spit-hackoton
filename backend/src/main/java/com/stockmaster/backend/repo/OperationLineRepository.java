package com.stockmaster.backend.repo;

import com.stockmaster.backend.entity.OperationLine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OperationLineRepository extends JpaRepository<OperationLine, Long> {

    // Useful for fetching all products linked to a specific operation
    List<OperationLine> findByOperationId(Long operationId);
}