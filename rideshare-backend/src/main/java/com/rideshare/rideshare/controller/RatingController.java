package com.rideshare.rideshare.controller;

import com.rideshare.rideshare.model.Rating;
import com.rideshare.rideshare.service.RatingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @PostMapping("/submit")
    public Rating submitRating(
            @RequestParam Long rideId,
            @RequestParam Long fromUserId,
            @RequestParam Long toUserId,
            @RequestParam int score,
            @RequestParam String comment
    ) {
        return ratingService.submitRating(rideId, fromUserId, toUserId, score, comment);
    }


    @GetMapping("/average")
    public Double getAverageRating(@RequestParam Long userId) {
        return ratingService.getAverageRating(userId);
    }
}