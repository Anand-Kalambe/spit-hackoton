package com.stockmaster.backend.service;

import com.stockmaster.backend.entity.InternalTransfer;
import com.stockmaster.backend.repository.InternalTransferRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InternalTransferService {

    private final InternalTransferRepository repository;

    public InternalTransferService(InternalTransferRepository repository) {
        this.repository = repository;
    }

    public List<InternalTransfer> getAllTransfers() {
        return repository.findAll();
    }
}
