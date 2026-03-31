package com.rideshare.rideshare.model;

import jakarta.persistence.*;
import lombok.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "ride_participants")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RideParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ride_id")
    @JsonIgnore // 🔥 prevent nesting
    private Ride ride;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    


    @Enumerated(EnumType.STRING)
    private RequestStatus status;
}