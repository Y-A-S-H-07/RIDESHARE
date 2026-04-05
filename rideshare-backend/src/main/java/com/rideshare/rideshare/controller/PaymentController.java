package com.rideshare.rideshare.controller;

import com.rideshare.rideshare.model.*;
import com.rideshare.rideshare.service.PaymentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

   
    public Transaction payAdvance(@RequestBody Transaction request) {
        return paymentService.payAdvance(
                request.getFromUser(),
                request.getRide()
        );
    }

   
    @PostMapping("/final")
    public Transaction payFinal(@RequestBody Transaction request) {
        return paymentService.payFinal(
                request.getFromUser(),
                request.getRide()
        );
    }

   
    @PostMapping("/pay-driver")
    public Transaction payDriver(@RequestBody Transaction request) {
        return paymentService.payDriver(
                request.getFromUser(),
                request.getToUser(),
                request.getRide()
        );
    }


    @PostMapping("/complete")
    public String completeRidePayment(@RequestParam Long rideId) {
        return paymentService.completeRidePayment(rideId);
    }
}