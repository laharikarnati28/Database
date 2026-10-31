package com.vehicleservice.dto;

import jakarta.validation.constraints.NotNull;

public class AssignTechnicianRequest {

    @NotNull(message = "Technician ID is required")
    private Long technicianId;

    public AssignTechnicianRequest() {}

    public AssignTechnicianRequest(Long technicianId) {
        this.technicianId = technicianId;
    }

    public Long getTechnicianId() {
        return technicianId;
    }

    public void setTechnicianId(Long technicianId) {
        this.technicianId = technicianId;
    }
}

