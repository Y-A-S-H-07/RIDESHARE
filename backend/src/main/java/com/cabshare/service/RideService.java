package com.cabshare.service;

import com.cabshare.entity.Ride;
import com.cabshare.entity.RideParticipant;
import com.cabshare.repository.RideParticipantRepository;
import com.cabshare.repository.RideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RideService {

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private RideParticipantRepository participantRepository;

    // Create ride
    public Ride createRide(Ride ride) {
        ride.setAvailableSeats(ride.getTotalSeats());
        ride.setStatus("CREATED");
        return rideRepository.save(ride);
    }

    // Join ride
    public String joinRide(Long rideId, Long userId) {

        Ride ride = rideRepository.findById(rideId).orElseThrow();

        // Check if already joined
        if (participantRepository.existsByRideIdAndUserId(rideId, userId)) {
            return "User already joined this ride";
        }

        // Check seat availability
        if (ride.getAvailableSeats() <= 0) {
            return "No seats available";
        }

        RideParticipant participant = new RideParticipant();
        participant.setRideId(rideId);
        participant.setUserId(userId);

        participantRepository.save(participant);

        ride.setAvailableSeats(ride.getAvailableSeats() - 1);
        rideRepository.save(ride);

        return "Joined ride successfully";
    }

    // Get single ride
    public Ride getRide(Long rideId) {
        return rideRepository.findById(rideId).orElseThrow();
    }

    // Get all rides
    public List<Ride> getAllRides() {
        return rideRepository.findAll();
    }
}