CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE courts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(100),
    court_name VARCHAR(100),
    slot_time VARCHAR(50)
);

INSERT INTO courts (name) VALUES
('Cricket Turf'),
('Badminton Court'),
('Football Ground');
