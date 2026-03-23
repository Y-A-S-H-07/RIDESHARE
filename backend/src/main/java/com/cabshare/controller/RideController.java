package com.cabshare.controller;

import com.cabshare.entity.Ride;
import com.cabshare.service.RideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ride")
public class RideController {

    @Autowired
    private RideService rideService;

    // Create ride
    @PostMapping("/create")
    public Ride createRide(@RequestBody Ride ride) {
        return rideService.createRide(ride);
    }

    // Join ride
    @PostMapping("/join")
    public String joinRide(@RequestParam Long rideId, @RequestParam Long userId) {
        return rideService.joinRide(rideId, userId);
    }

    // Get ride by ID
    @GetMapping("/{rideId}")
    public Ride getRide(@PathVariable Long rideId) {
        return rideService.getRide(rideId);
    }

    // Get all rides
    @GetMapping("/all")
    public List<Ride> getAllRides() {
        return rideService.getAllRides();
    }
}