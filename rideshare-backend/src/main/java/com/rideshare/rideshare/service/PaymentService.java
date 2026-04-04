package com.rideshare.rideshare.service;

import com.rideshare.rideshare.model.*;
import com.rideshare.rideshare.repository.TransactionRepository;
import com.rideshare.rideshare.repository.WalletRepository;
import com.rideshare.rideshare.repository.DriverRepository;
import com.rideshare.rideshare.repository.RideParticipantRepository;
import com.rideshare.rideshare.repository.RideRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List; // ✅ IMPORTANT FIX

@Service
public class PaymentService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private RideParticipantRepository participantRepository;

    // ❌ OLD METHODS (kept but not needed now)
    public Transaction payAdvance(User user, Ride rideRequest) {
        throw new RuntimeException("Advance payment not supported in new flow");
    }

    public Transaction payFinal(User user, Ride rideRequest) {
        throw new RuntimeException("Final payment not supported in new flow");
    }

    public Transaction payDriver(User host, User driverUser, Ride rideRequest) {
        throw new RuntimeException("Manual driver payment not supported in new flow");
    }

    // ✅ NEW FINAL PAYMENT LOGIC
    public String completeRidePayment(Long rideId) {
        return "Payment handled automatically during ride completion";
    }
}