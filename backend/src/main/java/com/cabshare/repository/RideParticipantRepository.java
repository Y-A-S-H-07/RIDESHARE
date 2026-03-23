package com.cabshare.repository;

import com.cabshare.entity.RideParticipant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RideParticipantRepository extends JpaRepository<RideParticipant, Long> {

    List<RideParticipant> findByRideId(Long rideId);

    // NEW METHOD
    boolean existsByRideIdAndUserId(Long rideId, Long userId);
}