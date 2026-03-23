package com.cabshare.service;

import com.cabshare.entity.User;
import com.cabshare.entity.Wallet;
import com.cabshare.repository.UserRepository;
import com.cabshare.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletRepository walletRepository;

    public User registerUser(User user) {

        // Save user
        User savedUser = userRepository.save(user);

        // Create wallet automatically
        Wallet wallet = new Wallet();
        wallet.setUser(savedUser);
        wallet.setBalance(0.0);

        walletRepository.save(wallet);

        return savedUser;
    }
}