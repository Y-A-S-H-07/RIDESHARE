package com.rideshare.rideshare.repository;

import com.rideshare.rideshare.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // ✅ ADD THIS METHOD
    List<Transaction> findByFromUserIdOrToUserIdOrderByIdDesc(Long fromUserId, Long toUserId);
}