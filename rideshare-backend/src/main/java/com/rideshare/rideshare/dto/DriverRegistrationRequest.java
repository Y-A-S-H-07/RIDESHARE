package com.rideshare.rideshare.dto;

import lombok.Data;

@Data
public class DriverRegistrationRequest {

    private String name;
    private String email;
    private String password;    


    private String vehicleName;
    private String vehicleNumber;
    private int maxSeats;
}