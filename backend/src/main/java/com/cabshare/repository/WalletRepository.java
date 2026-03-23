package com.cabshare.repository;

import com.cabshare.entity.Wallet;
import com.cabshare.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
    Wallet findByUser(User user);
}