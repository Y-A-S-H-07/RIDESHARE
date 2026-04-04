package com.rideshare.rideshare.model;

import jakarta.persistence.*;
import lombok.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
    @JsonIgnoreProperties({"participants"})
    private Ride ride; // 🔥 prevent nesting
    

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    


    @Enumerated(EnumType.STRING)
    private RequestStatus status;
}