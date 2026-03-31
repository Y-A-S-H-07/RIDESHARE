package com.rideshare.rideshare.controller;



import com.rideshare.rideshare.dto.DriverRegistrationRequest;
import com.rideshare.rideshare.model.Driver;
import com.rideshare.rideshare.service.DriverService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/drivers")
@CrossOrigin(origins = "http://localhost:3000")
public class DriverController {

    @Autowired
    private DriverService driverService;

    @PostMapping("/register")
    public Driver registerDriver(@RequestBody DriverRegistrationRequest request) {
        return driverService.registerDriver(request);
    }

    @GetMapping("/by-user")
    public Driver getDriverByUser(@RequestParam Long userId) {
        return driverService.getDriverByUserId(userId);
    }
}