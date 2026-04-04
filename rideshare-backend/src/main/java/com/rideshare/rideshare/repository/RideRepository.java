package com.rideshare.rideshare.repository;

import com.rideshare.rideshare.model.Ride;
import com.rideshare.rideshare.model.RideStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {

    List<Ride> findByAvailableSeatsGreaterThanAndStatus(int seats, RideStatus status);

    List<Ride> findBySourceIgnoreCaseAndDestinationIgnoreCaseAndStatus(
            String source,
            String destination,
            RideStatus status
    );

    boolean existsByDriverIdAndStatusIn(Long driverId, List<RideStatus> statuses);

    // ✅ ADD THIS
    boolean existsByHostIdAndStatusIn(Long hostId, List<RideStatus> statuses);
}