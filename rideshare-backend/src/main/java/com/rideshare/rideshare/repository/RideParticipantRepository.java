package com.rideshare.rideshare.repository;

import com.rideshare.rideshare.model.RideParticipant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RideParticipantRepository extends JpaRepository<RideParticipant, Long> {

    boolean existsByRideIdAndUserId(Long rideId, Long userId);

    // ✅ THIS IS MISSING → ADD
    List<RideParticipant> findByRideId(Long rideId);
}