package com.rideshare.rideshare.service;

import java.util.List;

import com.rideshare.rideshare.model.*;
import com.rideshare.rideshare.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@Service
public class RideService {

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RideParticipantRepository participantRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private WalletRepository walletRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    // 🔍 SEARCH RIDES
    public List<Ride> searchRides(String source, String destination) {
        return rideRepository
                .findBySourceIgnoreCaseAndDestinationIgnoreCaseAndStatus(
                        source,
                        destination,
                        RideStatus.CREATED
                );
    }

    // ✅ CREATE RIDE
    public Ride createRide(Ride ride) {

        int totalSeats = getSeatsFromVehicleType(ride.getVehicleType());
        ride.setTotalSeats(totalSeats);

        if (ride.getHostSeats() <= 0) {
            throw new RuntimeException("Host seats must be at least 1");
        }

        if (ride.getHostSeats() > totalSeats) {
            throw new RuntimeException("Host seats cannot exceed total seats");
        }

        if (ride.getHost() == null || ride.getHost().getId() == null) {
            throw new RuntimeException("Host is required");
        }

        // ✅ fetch host FIRST
        User host = userRepository.findById(ride.getHost().getId()).orElseThrow();
        ride.setHost(host);

        // ✅ ADD CHECK HERE (CORRECT PLACE)
        boolean hasActiveRide = rideRepository.existsByHostIdAndStatusIn(
                host.getId(),
                java.util.Arrays.asList(
                        RideStatus.CREATED,
                        RideStatus.ACCEPTED,
                        RideStatus.STARTED
                )
        );

        if (hasActiveRide) {
            throw new RuntimeException("You already have an active ride");
        }

        ride.setAvailableSeats(totalSeats - ride.getHostSeats());

        double distance = getDistanceFromAPI(ride.getSource(), ride.getDestination());
        ride.setDistance(distance);

        double totalFare = distance * 10;
        ride.setTotalFare(totalFare);

        ride.setStatus(RideStatus.CREATED);

        return rideRepository.save(ride);
    }

    // 🔧 VEHICLE TYPE LOGIC
    private int getSeatsFromVehicleType(String vehicleType) {
        if (vehicleType == null) return 4;

        vehicleType = vehicleType.trim().toUpperCase();

        switch (vehicleType) {
            case "3_SEATER": return 3;
            case "4_SEATER": return 4;
            case "5_SEATER": return 5;
            case "7_SEATER": return 7;
            default: return 4;
        }
    }

    // ✅ JOIN RIDE
    public String joinRide(Long rideId, User user) {

        Ride ride = rideRepository.findById(rideId).orElseThrow();

        if (ride.getStatus() != RideStatus.CREATED) {
            return "Cannot request. Ride already accepted or started";
        }

        if (participantRepository.existsByRideIdAndUserId(rideId, user.getId())) {
            return "Already requested this ride";
        }

        // 🔥 wallet check
        double minRequired = ride.getTotalFare() / 2.0;
        Wallet wallet = walletRepository.findByUserId(user.getId()).orElseThrow();

        if (wallet.getBalance() < minRequired) {
            return "Insufficient balance. Minimum required: " + minRequired;
        }

        if (ride.getAvailableSeats() <= 0) {
            return "No seats available";
        }

        // ✅ create request (NOT joining yet)
        RideParticipant participant = new RideParticipant();
        participant.setRide(ride);
        participant.setUser(user);
        participant.setStatus(RequestStatus.PENDING); // 🔥 IMPORTANT

        participantRepository.save(participant);
        
      
        Notification notification = new Notification();
        notification.setUser(ride.getHost());
        notification.setMessage("New join request from user " + user.getName());

        notificationRepository.save(notification);

        Notification userNotification = new Notification();
        userNotification.setUser(user);
        userNotification.setMessage(
            "You requested to join ride from " + ride.getSource() + " to " + ride.getDestination()
        );
        notificationRepository.save(userNotification);

        return "Request sent. Waiting for host approval.";
    }

    // ✅ GET ALL RIDES
    public List<Ride> getAllRides() {
        return rideRepository.findAll();
    }

    // ✅ AVAILABLE RIDES
    public List<Ride> getAvailableRides() {
        return rideRepository.findByAvailableSeatsGreaterThanAndStatus(0, RideStatus.CREATED);
    }

    // ✅ ACCEPT RIDE
    public Ride acceptRide(Long rideId, Long driverId) {
        // ❌ prevent multiple active rides
        boolean hasActiveRide = rideRepository.existsByDriverIdAndStatusIn(
                driverId,
                java.util.Arrays.asList(RideStatus.ACCEPTED, RideStatus.STARTED)
        );

        if (hasActiveRide) {
            throw new RuntimeException("Driver already has an active ride");
        }

        Ride ride = rideRepository.findById(rideId).orElseThrow();
        Driver driver = driverRepository.findById(driverId).orElseThrow();

        ride.setDriver(driver);
        ride.setStatus(RideStatus.ACCEPTED);

                // notify host
        Notification hostN = new Notification();
        hostN.setUser(ride.getHost());
        hostN.setMessage("Driver accepted your ride from " 
            + ride.getSource() + " to " + ride.getDestination());
        notificationRepository.save(hostN);

        // notify all participants
        List<RideParticipant> participants = participantRepository.findByRideId(rideId);

        for (RideParticipant p : participants) {
            Notification n = new Notification();
            n.setUser(p.getUser());
            n.setMessage("Driver accepted ride from " 
                + ride.getSource() + " to " + ride.getDestination());
            notificationRepository.save(n);
        }


        

        return rideRepository.save(ride);
    }

    // ✅ START RIDE
    public Ride startRide(Long rideId) {

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        // check status
        if (ride.getStatus() != RideStatus.ARRIVED) {
            throw new RuntimeException("Ride must be ARRIVED first");
        }

        // update status
        ride.setStatus(RideStatus.STARTED);

        // get participants
        List<RideParticipant> participants = participantRepository.findByRideId(rideId);

        // notify accepted participants
        for (RideParticipant p : participants) {
            if (p.getStatus() == RequestStatus.ACCEPTED) {
                Notification n = new Notification();
                n.setUser(p.getUser());
                n.setMessage("Ride started: " 
                        + ride.getSource() + " → " + ride.getDestination());
                notificationRepository.save(n);
            }
        }

        // notify host separately
        Notification hostN = new Notification();
        hostN.setUser(ride.getHost());
        hostN.setMessage("Your ride has started");
        notificationRepository.save(hostN);

        return rideRepository.save(ride);
    }
    // ✅ COMPLETE RIDE
   public Ride completeRide(Long rideId) {

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (ride.getStatus() != RideStatus.STARTED) {
            throw new RuntimeException("Ride must be STARTED first");
        }

        // ✅ mark completed
        ride.setStatus(RideStatus.COMPLETED);
        rideRepository.save(ride);

        // 🔥 AUTO PAYMENT STARTS

        List<RideParticipant> participants = participantRepository.findByRideId(rideId);

        int totalUsers = participants.size() + 1; // + host

        double perUserAmount = ride.getTotalFare() / totalUsers;

        // 🔻 deduct from joiners
        for (RideParticipant p : participants) {

            User user = p.getUser();
            Wallet wallet = walletRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Wallet not found"));

            if (wallet.getBalance() < perUserAmount) {
                throw new RuntimeException("User " + user.getId() + " has insufficient balance");
            }

            wallet.setBalance(wallet.getBalance() - perUserAmount);
            walletRepository.save(wallet);
        }

        // 🔻 deduct from host
        User host = ride.getHost();
        Wallet hostWallet = walletRepository.findByUserId(host.getId())
                .orElseThrow(() -> new RuntimeException("Host wallet not found"));

        if (hostWallet.getBalance() < perUserAmount) {
            throw new RuntimeException("Host has insufficient balance");
        }

        hostWallet.setBalance(hostWallet.getBalance() - perUserAmount);
        walletRepository.save(hostWallet);

        // 🔺 pay driver full amount
        Wallet driverWallet = walletRepository
                .findByUserId(ride.getDriver().getUser().getId())
                .orElseThrow(() -> new RuntimeException("Driver wallet not found"));

        driverWallet.setBalance(driverWallet.getBalance() + ride.getTotalFare());
        walletRepository.save(driverWallet);

        // 🔔 notify accepted participants
        for (RideParticipant p : participants) {
            if (p.getStatus() == RequestStatus.ACCEPTED) {
                Notification n = new Notification();
                n.setUser(p.getUser());
                n.setMessage("Ride completed: " 
                        + ride.getSource() + " → " + ride.getDestination());
                notificationRepository.save(n);
            }
        }

        // 🔔 notify host separately
        Notification hostN = new Notification();
        hostN.setUser(ride.getHost());
        hostN.setMessage("Your ride has been completed");
        notificationRepository.save(hostN);

        return ride;
    }



    public Ride cancelRide(Long rideId, Long userId) {

        Ride ride = rideRepository.findById(rideId).orElseThrow();

        // only host can cancel
        if (!ride.getHost().getId().equals(userId)) {
            throw new RuntimeException("Only host can cancel the ride");
        }

        // cannot cancel after start
        if (ride.getStatus() == RideStatus.STARTED || ride.getStatus() == RideStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel ride after it has started");
        }

        ride.setStatus(RideStatus.CANCELLED);

        return rideRepository.save(ride);
    }



    public String leaveRide(Long rideId, Long userId) {

        Ride ride = rideRepository.findById(rideId).orElseThrow();

        // ❌ cannot leave after start
        if (ride.getStatus() != RideStatus.CREATED && ride.getStatus() != RideStatus.ACCEPTED) {
            return "Cannot leave ride after it has started";
        }

        RideParticipant participant = participantRepository
                .findByRideId(rideId)
                .stream()
                .filter(p -> p.getUser().getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User not part of this ride"));

        // ✅ delete ONCE
        participantRepository.delete(participant);

        // ✅ increase seat
        ride.setAvailableSeats(ride.getAvailableSeats() + 1);
        rideRepository.save(ride);

        return "Left ride successfully";
    }



    public String acceptRequest(Long rideId, Long userId, Long hostId) {

        Ride ride = rideRepository.findById(rideId).orElseThrow();

        // only host can accept
        if (!ride.getHost().getId().equals(hostId)) {
            return "Only host can accept requests";
        }

        // check seats
        if (ride.getAvailableSeats() <= 0) {
            return "No seats available";
        }

        RideParticipant participant = participantRepository
                .findByRideId(rideId)
                .stream()
                .filter(p -> p.getUser().getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (participant.getStatus() != RequestStatus.PENDING) {
            return "Request already processed";
        }

        // ✅ accept
        participant.setStatus(RequestStatus.ACCEPTED);
        participantRepository.save(participant);

        ride.setAvailableSeats(ride.getAvailableSeats() - 1);
        rideRepository.save(ride);

    
        Notification notification = new Notification();
        notification.setUser(participant.getUser());
        notification.setMessage(
            "You are confirmed for ride from " + ride.getSource() + " to " + ride.getDestination()
        );

        notificationRepository.save(notification);

        return "Request accepted";
    }


    public String rejectRequest(Long rideId, Long userId, Long hostId) {

        Ride ride = rideRepository.findById(rideId).orElseThrow();

        if (!ride.getHost().getId().equals(hostId)) {
            return "Only host can reject requests";
        }

        RideParticipant participant = participantRepository
                .findByRideId(rideId)
                .stream()
                .filter(p -> p.getUser().getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Request not found"));

        participant.setStatus(RequestStatus.REJECTED);
        participantRepository.save(participant);



        Notification notification = new Notification();
        notification.setUser(participant.getUser());
        notification.setMessage(
            "Request rejected for ride from " 
            + ride.getSource() + " to " + ride.getDestination()
        );

        notificationRepository.save(notification);

        return "Request rejected";
    }



    private double getDistanceFromAPI(String source, String destination) {

        try {
            // simple city → coords mapping (for demo)
            String src = getCoordinates(source);
            String dest = getCoordinates(destination);

            String url = "https://router.project-osrm.org/route/v1/driving/"
                    + src + ";" + dest + "?overview=false";

            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

            Map body = response.getBody();

            if (body == null || !body.containsKey("routes")) {
                throw new RuntimeException("Invalid response from map API");
            }

            var routes = (java.util.List<Map>) body.get("routes");
            var route = routes.get(0);

            double distanceMeters = (double) route.get("distance");

            return distanceMeters / 1000.0; // convert to KM

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch distance: " + e.getMessage());
        }
    }


    private String getCoordinates(String city) {

        try {
            String url = "https://nominatim.openstreetmap.org/search?q="
                    + city + "&format=json&limit=1";

            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("User-Agent", "ride-sharing-app"); // 🔥 REQUIRED

            org.springframework.http.HttpEntity<String> entity =
                    new org.springframework.http.HttpEntity<>(headers);

            ResponseEntity<java.util.List> response =
                    restTemplate.exchange(url,
                            org.springframework.http.HttpMethod.GET,
                            entity,
                            java.util.List.class);

            var list = response.getBody();

            if (list == null || list.isEmpty()) {
                throw new RuntimeException("City not found: " + city);
            }

            Map data = (Map) list.get(0);

            String lat = (String) data.get("lat");
            String lon = (String) data.get("lon");

            return lon + "," + lat;

        } catch (Exception e) {
            throw new RuntimeException("Failed to get coordinates: " + e.getMessage());
        }
    }


    public List<Ride> smartSearch(String source, String destination) {

        List<Ride> allRides = rideRepository.findAll();

        return allRides.stream()
                .filter(r -> r.getStatus() == RideStatus.CREATED)
                .filter(r -> r.getAvailableSeats() > 0)
                .filter(r -> r.getDestination().equalsIgnoreCase(destination))
                .sorted((r1, r2) -> {
                    int score1 = calculateScore(r1, source);
                    int score2 = calculateScore(r2, source);
                    return Integer.compare(score2, score1); // higher first
                })
                .toList();
    }



    private int calculateScore(Ride ride, String userSource) {

        int score = 0;

        // 1️⃣ Exact source match
        if (ride.getSource().equalsIgnoreCase(userSource)) {
            score += 50;
        }

        // 2️⃣ Partial match (simple AI trick)
        else if (ride.getSource().toLowerCase().contains(userSource.toLowerCase())
                || userSource.toLowerCase().contains(ride.getSource().toLowerCase())) {
            score += 30;
        }

        // 3️⃣ More available seats = better
        score += ride.getAvailableSeats() * 5;

        // 4️⃣ Shorter distance (optional tweak)
        if (ride.getDistance() < 100) {
            score += 10;
        }

        return score;
    }


    public double calculateEstimatedFare(String source, String destination, String vehicleType) {

        double distance;

        try {
            distance = getDistanceFromAPI(source, destination);
        } catch (Exception e) {
            distance = 10; // fallback
        }

        double baseRate = 10;

        double multiplier;

        switch (vehicleType) {
            case "3_SEATER": multiplier = 1; break;
            case "4_SEATER": multiplier = 1.2; break;
            case "5_SEATER": multiplier = 1.5; break;
            case "7_SEATER": multiplier = 2; break;
            default: multiplier = 1;
        }

        return distance * baseRate * multiplier;
    }


    public Ride arrivedRide(Long rideId) {

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        // check status
        if (ride.getStatus() != RideStatus.ACCEPTED) {
            throw new RuntimeException("Ride must be ACCEPTED first");
        }

        // update status
        ride.setStatus(RideStatus.ARRIVED);

        // notify ALL participants
        List<RideParticipant> participants = participantRepository.findByRideId(rideId);

        for (RideParticipant p : participants) {
            Notification n = new Notification();
            n.setUser(p.getUser());
            n.setMessage("Driver has arrived at pickup point");
            notificationRepository.save(n);
        }

        // notify host separately
        Notification hostN = new Notification();
        hostN.setUser(ride.getHost());
        hostN.setMessage("Driver has arrived for your ride");
        notificationRepository.save(hostN);

        return rideRepository.save(ride);
    }
}