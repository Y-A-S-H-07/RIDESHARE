package com.cabshare.controller;

import com.cabshare.entity.User;
import com.cabshare.entity.Wallet;
import com.cabshare.repository.UserRepository;
import com.cabshare.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wallet")
public class WalletController {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private UserRepository userRepository;

    // Get wallet balance
    @GetMapping("/balance/{userId}")
    public Double getBalance(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        Wallet wallet = walletRepository.findByUser(user);
        return wallet.getBalance();
    }

    // Add money
    @PostMapping("/add")
    public String addMoney(@RequestParam Long userId, @RequestParam Double amount) {

        User user = userRepository.findById(userId).orElseThrow();
        Wallet wallet = walletRepository.findByUser(user);

        wallet.setBalance(wallet.getBalance() + amount);
        walletRepository.save(wallet);

        return "Money added successfully";
    }
}