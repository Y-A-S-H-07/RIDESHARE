package com.rideshare.rideshare.service;

import com.rideshare.rideshare.dto.DriverRegistrationRequest;
import com.rideshare.rideshare.model.Driver;
import com.rideshare.rideshare.model.Role;
import com.rideshare.rideshare.model.User;
import com.rideshare.rideshare.model.Wallet;

import com.rideshare.rideshare.repository.DriverRepository;
import com.rideshare.rideshare.repository.UserRepository;
import com.rideshare.rideshare.repository.WalletRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DriverService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private WalletRepository walletRepository;

    public Driver registerDriver(DriverRegistrationRequest request) {

        // 🔥 check duplicate email
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // create user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(Role.DRIVER);

        user = userRepository.save(user);

        // create driver
        Driver driver = new Driver();
        driver.setVehicleName(request.getVehicleName());
        driver.setVehicleNumber(request.getVehicleNumber());
        driver.setMaxSeats(request.getMaxSeats());
        driver.setUser(user);

        Driver savedDriver = driverRepository.save(driver);

        // 🔥 CREATE WALLET FOR DRIVER
        Wallet wallet = new Wallet();
        wallet.setUser(user);
        wallet.setBalance(0.0);

        walletRepository.save(wallet);

        return savedDriver;
    }

    public Driver getDriverByUserId(Long userId) {
        return driverRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
    }
}