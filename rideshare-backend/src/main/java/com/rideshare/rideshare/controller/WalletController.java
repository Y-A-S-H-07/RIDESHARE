package com.rideshare.rideshare.controller;

import com.rideshare.rideshare.model.TransactionType;
import com.rideshare.rideshare.model.Wallet;
import com.rideshare.rideshare.repository.WalletRepository;
import com.rideshare.rideshare.repository.TransactionRepository;
import com.rideshare.rideshare.repository.UserRepository;
import com.rideshare.rideshare.dto.WalletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.rideshare.rideshare.model.Transaction;
import com.rideshare.rideshare.model.User;
import com.rideshare.rideshare.model.TransactionType;

@RestController
@RequestMapping("/wallet")
@CrossOrigin(origins = "http://localhost:3000")
public class WalletController {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    
    @PostMapping("/add")
    public Wallet addMoney(@RequestBody WalletRequest request) {

        Wallet wallet = walletRepository
                .findByUserId(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        // update balance
        wallet.setBalance(wallet.getBalance() + request.getAmount());
        walletRepository.save(wallet);

        // create transaction
        User user = userRepository.findById(request.getUserId()).orElseThrow();

        Transaction txn = new Transaction();
        txn.setAmount(request.getAmount());
        txn.setType(TransactionType.ADVANCE);
        txn.setStatus("SUCCESS");

        txn.setFromUser(user);
        txn.setToUser(user);
        txn.setRide(null);
        txn.setCreatedAt(java.time.LocalDateTime.now());

        transactionRepository.save(txn);

        return wallet;
    }
}