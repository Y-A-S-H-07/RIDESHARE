package com.cabshare.service;

import com.cabshare.entity.Transaction;
import com.cabshare.entity.User;
import com.cabshare.entity.Wallet;
import com.cabshare.repository.TransactionRepository;
import com.cabshare.repository.UserRepository;
import com.cabshare.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public String sendMoney(Long senderId, Long receiverId, Double amount) {

        User sender = userRepository.findById(senderId).orElseThrow();
        User receiver = userRepository.findById(receiverId).orElseThrow();

        Wallet senderWallet = walletRepository.findByUser(sender);
        Wallet receiverWallet = walletRepository.findByUser(receiver);

        if (senderWallet.getBalance() < amount) {
            return "Insufficient balance";
        }

        // Deduct from sender
        senderWallet.setBalance(senderWallet.getBalance() - amount);

        // Add to receiver
        receiverWallet.setBalance(receiverWallet.getBalance() + amount);

        walletRepository.save(senderWallet);
        walletRepository.save(receiverWallet);

        // Save transaction
        Transaction txn = new Transaction();
        txn.setSenderId(senderId);
        txn.setReceiverId(receiverId);
        txn.setAmount(amount);
        txn.setStatus("SUCCESS");

        transactionRepository.save(txn);

        return "Payment successful";
    }
}