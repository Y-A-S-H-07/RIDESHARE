package com.cabshare.controller;

import com.cabshare.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/send")
    public String sendMoney(
            @RequestParam Long senderId,
            @RequestParam Long receiverId,
            @RequestParam Double amount
    ) {
        return paymentService.sendMoney(senderId, receiverId, amount);
    }
}