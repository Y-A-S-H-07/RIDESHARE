package com.rideshare.rideshare.controller;

import java.util.List;

import com.rideshare.rideshare.model.Ride;
import com.rideshare.rideshare.model.User;
import com.rideshare.rideshare.service.AIService;
import com.rideshare.rideshare.service.RideService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rides")


@CrossOrigin(origins = "http://localhost:3000")
public class RideController {

    @Autowired
    private RideService rideService;

    @Autowired
    private AIService aiService;

    // 🔍 Search rides
    @GetMapping("/search")
    public List<Ride> searchRides(
            @RequestParam String source,
            @RequestParam String destination
    ) {
        return rideService.searchRides(source, destination);
    }

    // ➕ Create ride
    @PostMapping("/create")
    public Ride createRide(@RequestBody Ride ride) {
        return rideService.createRide(ride);
    }

    // 👥 Join ride
    @PostMapping("/join")
    public String joinRide(@RequestParam Long rideId, @RequestBody User user) {
        return rideService.joinRide(rideId, user);
    }

    // 📋 Get all rides
    @GetMapping("/all")
    public List<Ride> getAllRides() {
        return rideService.getAllRides();
    }

    // ✅ Available rides
    @GetMapping("/available")
    public List<Ride> getAvailableRides() {
        return rideService.getAvailableRides();
    }

    // 🚗 Driver accepts ride
    @PostMapping("/accept")
    public Ride acceptRide(@RequestParam Long rideId, @RequestParam Long driverId) {
        return rideService.acceptRide(rideId, driverId);
    }

    @PostMapping("/start")
    public Ride startRide(@RequestParam Long rideId) {
        return rideService.startRide(rideId);
    }

    @PostMapping("/complete")
    public Ride completeRide(@RequestParam Long rideId) {
        return rideService.completeRide(rideId);
    }


    @PostMapping("/cancel")
    public Ride cancelRide(@RequestParam Long rideId, @RequestParam Long userId) {
        return rideService.cancelRide(rideId, userId);
    }



    @PostMapping("/leave")
    public String leaveRide(@RequestParam Long rideId, @RequestParam Long userId) {
        return rideService.leaveRide(rideId, userId);
    }


    @PostMapping("/accept-request")
    public String acceptRequest(
            @RequestParam Long rideId,
            @RequestParam Long userId,
            @RequestParam Long hostId
    ) {
        return rideService.acceptRequest(rideId, userId, hostId);
    }

    @PostMapping("/reject-request")
    public String rejectRequest(
            @RequestParam Long rideId,
            @RequestParam Long userId,
            @RequestParam Long hostId
    ) {
        return rideService.rejectRequest(rideId, userId, hostId);
    }


    @GetMapping("/smart-search")
    public List<Ride> smartSearch(
            @RequestParam String source,
            @RequestParam String destination
    ) {
        return rideService.smartSearch(source, destination);
    }


    @GetMapping("/ai-suggest")
    public String aiSuggest(
            @RequestParam String source,
            @RequestParam String destination
    ) {
        List<Ride> rides = rideService.smartSearch(source, destination);
        return aiService.suggestRide(source, destination, rides);
    }
}