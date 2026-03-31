package com.rideshare.rideshare.service;

import com.rideshare.rideshare.model.*;
import com.rideshare.rideshare.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private UserRepository userRepository;

    public Rating submitRating(Long rideId, Long fromUserId, Long toUserId, int score, String comment) {

        Ride ride = rideRepository.findById(rideId).orElseThrow();

        // ❌ allow only after ride completed
        if (ride.getStatus() != RideStatus.COMPLETED) {
            throw new RuntimeException("Cannot rate before ride completion");
        }

        User fromUser = userRepository.findById(fromUserId).orElseThrow();
        User toUser = userRepository.findById(toUserId).orElseThrow();

        // ❌ prevent self rating
        if (fromUserId.equals(toUserId)) {
            throw new RuntimeException("You cannot rate yourself");
        }

        // ❌ score validation
        if (score < 1 || score > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        Rating rating = new Rating();
        rating.setRide(ride);
        rating.setFromUser(fromUser);
        rating.setToUser(toUser);
        rating.setScore(score);
        rating.setComment(comment);

        return ratingRepository.save(rating);
    }


    public Double getAverageRating(Long userId) {

        Double avg = ratingRepository.getAverageRatingByUserId(userId);

        if (avg == null) {
            return 0.0;
        }

        return Math.round(avg * 10.0) / 10.0; // round to 1 decimal
    }
}