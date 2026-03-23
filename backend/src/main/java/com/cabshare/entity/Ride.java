package com.cabshare.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String source;
    private String destination;

    private int totalSeats;
    private int availableSeats;

    private Double totalFare;

    private String status; // CREATED / COMPLETED
}