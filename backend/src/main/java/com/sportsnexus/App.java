package com.sportsnexus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@SpringBootApplication
@RestController
@CrossOrigin("*")
public class App {

    private List<Map<String, String>> bookings = new ArrayList<>();

    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }

    @GetMapping("/api/health")
    public String health() {
        return "Sports Nexus API Running 🚀";
    }

    @PostMapping("/api/book")
    public String bookSlot(@RequestBody Map<String, String> booking) {

        for (Map<String, String> b : bookings) {
            if (b.get("slot").equals(booking.get("slot"))) {
                return "❌ Slot already booked!";
            }
        }

        bookings.add(booking);
        return "✅ Booking Confirmed for " + booking.get("name");
    }

    @GetMapping("/api/bookings")
    public List<Map<String, String>> getBookings() {
        return bookings;
    }
}
