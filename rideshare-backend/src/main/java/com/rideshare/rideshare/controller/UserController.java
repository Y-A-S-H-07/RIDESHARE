package com.rideshare.rideshare.controller;

import com.rideshare.rideshare.model.User;
import com.rideshare.rideshare.model.Wallet;
import com.rideshare.rideshare.model.Notification;
import com.rideshare.rideshare.repository.NotificationRepository;
import com.rideshare.rideshare.repository.TransactionRepository;
import com.rideshare.rideshare.service.UserService;
import com.rideshare.rideshare.model.Transaction;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:3000")

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationRepository notificationRepository;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @GetMapping("/notifications")
    public List<Notification> getNotifications(@RequestParam Long userId) {
        return notificationRepository.findByUserId(userId);
    }


    @PostMapping("/login")
    public User login(@RequestBody User user) {
        return userService.login(user.getEmail(), user.getPassword());
    }


    @GetMapping("/wallet")
    public Wallet getWallet(@RequestParam Long userId) {
        return userService.getWallet(userId);
    }


    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping("/transactions")
    public List<Transaction> getUserTransactions(@RequestParam Long userId) {
        return transactionRepository
                .findByFromUserIdOrToUserIdOrderByIdDesc(userId, userId);
    }



    
}