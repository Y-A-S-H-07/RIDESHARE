package com.rideshare.rideshare.dto;

import lombok.Data;

@Data
public class WalletRequest {
    private Long userId;
    private double amount;
}