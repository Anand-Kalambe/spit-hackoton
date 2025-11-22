package com.stockmaster.backend.controller;

import com.stockmaster.backend.entity.InternalTransfer;
import com.stockmaster.backend.service.InternalTransferService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/internal-transfer")
public class InternalTransferController {

    private final InternalTransferService service;

    public InternalTransferController(InternalTransferService service) {
        this.service = service;
    }

    @GetMapping
    public List<InternalTransfer> getAll() {
        return service.getAllTransfers();
    }
}
