package com.rideshare.rideshare.repository;

import com.rideshare.rideshare.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
}