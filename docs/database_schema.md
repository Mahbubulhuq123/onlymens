# OnlyMen Database Schema Proposal

This schema is designed for a PostgreSQL database. It supports the two-sided marketplace (Customers and Helpers) and all the required features such as bookings, verification, payments, and reviews.

## 1. `users`
Core user table for authentication and basic profile.
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `phone_number` (String, Unique)
- `password_hash` (String)
- `role` (Enum: 'CUSTOMER', 'HELPER', 'ADMIN')
- `created_at` (Timestamp)
- `updated_at` (Timestamp)
- `is_active` (Boolean)

## 2. `customer_profiles`
Extended details for customers.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> `users.id`)
- `first_name` (String)
- `last_name` (String)
- `profile_picture_url` (String)

## 3. `helper_profiles`
Extended details for helpers.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> `users.id`)
- `first_name` (String)
- `last_name` (String)
- `profile_picture_url` (String)
- `hourly_rate` (Decimal)
- `is_online` (Boolean)
- `current_location_lat` (Float)
- `current_location_lng` (Float)
- `average_rating` (Float)
- `completed_jobs` (Int)

## 4. `helper_verifications`
Tracks the identity verification process for helpers.
- `id` (UUID, Primary Key)
- `helper_id` (UUID, Foreign Key -> `helper_profiles.id`)
- `nid_number` (String)
- `nid_front_image_url` (String)
- `nid_back_image_url` (String)
- `status` (Enum: 'PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED')
- `reviewed_by` (UUID, Foreign Key -> `users.id` - Admin)
- `rejection_reason` (String, Nullable)

## 5. `services`
The types of services offered (e.g., Shopping Assistance, Moving Help).
- `id` (UUID, Primary Key)
- `name` (String)
- `description` (String)
- `icon_name` (String)
- `is_active` (Boolean)

## 6. `helper_skills`
Mapping helpers to the services they provide.
- `helper_id` (UUID, Foreign Key -> `helper_profiles.id`)
- `service_id` (UUID, Foreign Key -> `services.id`)
- Primary Key (`helper_id`, `service_id`)

## 7. `bookings`
The core transactional entity representing a job.
- `id` (UUID, Primary Key)
- `customer_id` (UUID, Foreign Key -> `customer_profiles.id`)
- `helper_id` (UUID, Foreign Key -> `helper_profiles.id`, Nullable until accepted)
- `service_id` (UUID, Foreign Key -> `services.id`)
- `status` (Enum: 'PENDING', 'SEARCHING', 'ACCEPTED', 'CONFIRMED', 'HELPER_ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED')
- `task_description` (Text)
- `scheduled_date` (Date)
- `scheduled_time` (Time)
- `estimated_duration_hours` (Int)
- `estimated_price` (Decimal)
- `final_price` (Decimal, Nullable)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## 8. `booking_locations`
Stores location details for a booking.
- `id` (UUID, Primary Key)
- `booking_id` (UUID, Foreign Key -> `bookings.id`)
- `address_line` (String)
- `latitude` (Float)
- `longitude` (Float)

## 9. `payments`
Tracks payments made by the customer.
- `id` (UUID, Primary Key)
- `booking_id` (UUID, Foreign Key -> `bookings.id`)
- `amount` (Decimal)
- `platform_commission` (Decimal)
- `helper_earning` (Decimal)
- `payment_method` (Enum: 'BKASH', 'NAGAD', 'SSLCOMMERZ', 'CARD', 'CASH')
- `status` (Enum: 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')
- `transaction_id` (String)
- `created_at` (Timestamp)

## 10. `reviews`
Ratings and reviews left by users after a job.
- `id` (UUID, Primary Key)
- `booking_id` (UUID, Foreign Key -> `bookings.id`)
- `reviewer_id` (UUID, Foreign Key -> `users.id`)
- `reviewee_id` (UUID, Foreign Key -> `users.id`)
- `rating` (Int, 1-5)
- `comment` (Text)
- `created_at` (Timestamp)

## 11. `messages`
Chat messages between customer and helper during an active booking.
- `id` (UUID, Primary Key)
- `booking_id` (UUID, Foreign Key -> `bookings.id`)
- `sender_id` (UUID, Foreign Key -> `users.id`)
- `content` (Text)
- `created_at` (Timestamp)

## 12. `reports_and_disputes`
For reporting users or raising disputes on a booking.
- `id` (UUID, Primary Key)
- `booking_id` (UUID, Foreign Key -> `bookings.id`, Nullable)
- `reporter_id` (UUID, Foreign Key -> `users.id`)
- `reported_id` (UUID, Foreign Key -> `users.id`, Nullable)
- `type` (Enum: 'DISPUTE', 'SAFETY_REPORT', 'FRAUD')
- `description` (Text)
- `status` (Enum: 'OPEN', 'IN_REVIEW', 'RESOLVED')
- `resolution` (Text)
