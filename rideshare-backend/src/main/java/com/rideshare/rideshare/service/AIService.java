package com.rideshare.rideshare.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.rideshare.rideshare.model.Ride;

import org.springframework.http.*;

import java.util.*;

@Service
public class AIService {

    private final String API_KEY = "AIzaSyC8Oz1fOMwwTV_i_j1a9bfDHp86SNvc4I0"; // 🔥 put NEW key here

    private final String URL =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";
    private final RestTemplate restTemplate = new RestTemplate();

    public String suggestRide(String userSource, String userDestination, List<Ride> rides) {

        try {
            String prompt = "User wants ride from " + userSource + " to " + userDestination +
                    ". Available rides: " + rides +
                    ". Suggest best ride in one short sentence.";

            Map<String, Object> body = new HashMap<>();

            Map<String, Object> text = new HashMap<>();
            text.put("text", prompt);

            Map<String, Object> part = new HashMap<>();
            part.put("parts", List.of(text));

            body.put("contents", List.of(part));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity =
                    new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    URL + API_KEY,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            List candidates = (List) response.getBody().get("candidates");
            Map content = (Map) ((Map) candidates.get(0)).get("content");
            List parts = (List) content.get("parts");

            return (String) ((Map) parts.get(0)).get("text");

        } catch (Exception e) {

            

            if (rides.isEmpty()) {
                return "No rides available";
            }

            Ride bestRide = rides.get(0);
            

            return "Best ride is Ride ID " + bestRide.getId() +
                    " from " + bestRide.getSource() +
                    " to " + bestRide.getDestination() +
                    " with " + bestRide.getAvailableSeats() +
                    " seats available.";
                    
        }
    }
}