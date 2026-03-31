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

        Ride ride = rideRepository.findById(rideId).orElseThrow();

        if (ride.getStatus() != RideStatus.COMPLETED) {
            return "Ride not completed yet";
        }

        if (ride.getDriver() == null) {
            return "Driver not assigned";
        }

        // 🔥 get all participants
        List<RideParticipant> participants = participantRepository.findByRideId(rideId);

        int totalUsers = participants.size() + 1; // + host

        double perUserAmount = ride.getTotalFare() / totalUsers;

        // 🔥 collect from joiners
        for (RideParticipant p : participants) {

            User user = p.getUser();
            Wallet wallet = walletRepository.findByUserId(user.getId()).orElseThrow();

            if (wallet.getBalance() < perUserAmount) {
                return "User " + user.getId() + " has insufficient balance";
            }

            wallet.setBalance(wallet.getBalance() - perUserAmount);
            walletRepository.save(wallet);

            // transaction
            Transaction tx = new Transaction();
            tx.setFromUser(user);
            tx.setToUser(ride.getDriver().getUser());
            tx.setRide(ride);
            tx.setAmount(perUserAmount);
            tx.setType(TransactionType.FINAL);
            tx.setStatus("SUCCESS");

            transactionRepository.save(tx);
        }

        // 🔥 host payment
        User host = ride.getHost();
        Wallet hostWallet = walletRepository.findByUserId(host.getId()).orElseThrow();

        if (hostWallet.getBalance() < perUserAmount) {
            return "Host has insufficient balance";
        }

        hostWallet.setBalance(hostWallet.getBalance() - perUserAmount);
        walletRepository.save(hostWallet);

        // host transaction
        Transaction hostTx = new Transaction();
        hostTx.setFromUser(host);
        hostTx.setToUser(ride.getDriver().getUser());
        hostTx.setRide(ride);
        hostTx.setAmount(perUserAmount);
        hostTx.setType(TransactionType.FINAL);
        hostTx.setStatus("SUCCESS");

        transactionRepository.save(hostTx);

        // 🔥 pay driver total
        Wallet driverWallet = walletRepository
                .findByUserId(ride.getDriver().getUser().getId())
                .orElseThrow();

        driverWallet.setBalance(driverWallet.getBalance() + ride.getTotalFare());
        walletRepository.save(driverWallet);

        return "Payment completed successfully";
    }
}