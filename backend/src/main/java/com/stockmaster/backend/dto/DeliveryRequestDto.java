package com.stockmaster.backend.dto;

import java.time.LocalDate;
import java.util.List;

// Represents the entire delivery document header and lines
public class DeliveryRequestDto {
    private Long responsibleUserId;
    private Integer sourceLocationId;
    private Integer destinationLocationId;
    private LocalDate scheduledDate;
    private String notes;

    // The list of products being delivered
    private List<DeliveryLineDto> lines;
}