package com.stockmaster.backend.repo;

import com.stockmaster.backend.entity.StockLedgerEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockLedgerEntryRepository extends JpaRepository<StockLedgerEntry, Long> {

    // Used to look up the full history of moves for a given product or operation
}