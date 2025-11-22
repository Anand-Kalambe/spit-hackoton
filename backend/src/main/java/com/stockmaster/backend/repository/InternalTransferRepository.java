package com.stockmaster.backend.repository;

import com.stockmaster.backend.entity.InternalTransfer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InternalTransferRepository extends JpaRepository<InternalTransfer, Integer> {
}
