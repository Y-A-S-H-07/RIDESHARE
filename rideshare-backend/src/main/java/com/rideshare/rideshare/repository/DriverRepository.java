package com.rideshare.rideshare.repository;

import java.util.Optional;
import com.rideshare.rideshare.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DriverRepository extends JpaRepository<Driver, Long> {

    Optional<Driver> findByUserId(Long userId);

    // NEW METHOD
    boolean existsByUserIdAndIdNotNull(Long userId);
}