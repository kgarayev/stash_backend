-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 23, 2023 at 07:37 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `stash`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `account_name` varchar(64) NOT NULL,
  `account_number` int(8) NOT NULL,
  `sort_code` int(6) NOT NULL,
  `currency_code` varchar(3) NOT NULL,
  `currency_name` varchar(64) NOT NULL,
  `currency_symbol` varchar(2) NOT NULL,
  `currency_country` varchar(64) NOT NULL,
  `balance` decimal(10,2) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `account_name`, `account_number`, `sort_code`, `currency_code`, `currency_name`, `currency_symbol`, `currency_country`, `balance`, `user_id`, `created`) VALUES
(1, 'savings account', 12345678, 123456, 'gbp', 'british pound', '£', 'UK', 5000.00, 1000, '2023-07-23 18:15:16'),
(6, 'current account', 12345078, 123406, 'gbp', 'british pound', '£', 'UK', 5000.00, 1000, '2023-07-23 18:16:39'),
(7, 'current account', 11345078, 113406, 'gbp', 'british pound', '£', 'UK', 5000.00, 1000, '2023-07-23 18:16:45');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `type` varchar(64) NOT NULL,
  `details` varchar(64) NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp(),
  `amount` decimal(10,2) NOT NULL,
  `account_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `type`, `details`, `date`, `amount`, `account_id`) VALUES
(1, 'sent', 'Morty Smith', '2023-07-23', 199.99, 1),
(2, 'sent', 'Slick Sanchez', '2023-07-23', 199.99, 1),
(3, 'sent', 'Slick Sanchez', '2023-07-23', 199.99, 1),
(4, 'sent', 'Slick Sanchez', '2023-07-23', 199.99, 1),
(5, 'sent', 'Slick Sanchez', '2023-07-23', 199.99, 1),
(6, 'sent', 'Slick Sanchez', '2023-07-23', 199.99, 1),
(7, 'sent', 'Slick Sanchez', '2023-07-23', 199.99, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `number` varchar(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `dob` date NOT NULL,
  `password` varchar(50) NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `number`, `email`, `dob`, `password`, `created`) VALUES
(1000, 'Richard', 'Sanchez', '078624566', 'ricksanchez@gmail.com', '1900-02-10', 'Rick12345', '2023-07-22 00:00:00'),
(1011, 'Marge', 'Griffin', '07765753455', 'dfgdfg@gmail.com', '1968-01-01', 'Peter1234', '2023-07-22 22:42:15'),
(1015, 'Homer', 'Simpson', '07765756455', 'peter@gmail.com', '1968-01-01', 'MATA123rfG', '2023-07-22 22:44:59'),
(1016, 'Bart', 'Simpson', '07744756455', 'bartr@gmail.com', '1980-01-01', 'Bart1234', '2023-07-23 17:20:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `account_number` (`account_number`),
  ADD UNIQUE KEY `sort_code` (`sort_code`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `number` (`number`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1021;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
