package com.rideshare.rideshare.repository;

import com.rideshare.rideshare.model.Ride;
import com.rideshare.rideshare.model.RideStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {

    // available rides
    List<Ride> findByAvailableSeatsGreaterThanAndStatus(int seats, RideStatus status);

    // 🔥 smart search (case-insensitive)
    List<Ride> findBySourceIgnoreCaseAndDestinationIgnoreCaseAndStatus(
            String source,
            String destination,
            RideStatus status
    );


    boolean existsByDriverIdAndStatusIn(Long driverId, List<RideStatus> statuses);
}