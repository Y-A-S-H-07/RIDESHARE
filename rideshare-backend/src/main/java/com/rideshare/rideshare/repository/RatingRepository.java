package com.rideshare.rideshare.repository;

import com.rideshare.rideshare.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.toUser.id = :userId")
    Double getAverageRatingByUserId(Long userId);
}