-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 19, 2026 at 12:10 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `berwashop`
--

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `ProductCode` int(11) NOT NULL,
  `ProductName` varchar(100) NOT NULL,
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`ProductCode`, `ProductName`, `Created_At`) VALUES
(3, 'Amashu', '2026-05-19 08:35:22'),
(4, 'Imboga', '2026-05-19 08:36:16'),
(5, 'Ibijumba', '2026-05-19 08:36:27');

-- --------------------------------------------------------

--
-- Table structure for table `productin`
--

CREATE TABLE `productin` (
  `ProductInId` int(11) NOT NULL,
  `ProductCode` int(11) NOT NULL,
  `Date` timestamp NOT NULL DEFAULT current_timestamp(),
  `Quantity` int(11) DEFAULT 0,
  `UnitPrice` decimal(10,2) NOT NULL,
  `TotalPrice` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productin`
--

INSERT INTO `productin` (`ProductInId`, `ProductCode`, `Date`, `Quantity`, `UnitPrice`, `TotalPrice`) VALUES
(4, 3, '2026-05-19 08:35:35', 3, 2000.00, 6000.00),
(5, 4, '2026-05-19 08:36:38', 5, 200.00, 1000.00),
(6, 5, '2026-05-19 08:36:47', 10, 10000.00, 100000.00),
(7, 5, '2026-05-19 09:13:20', 1, 1000.00, 1000.00),
(8, 5, '2026-05-19 09:38:52', 1, 444.00, 444.00),
(9, 5, '2026-05-19 09:38:57', 4, 4.00, 16.00),
(10, 5, '2026-05-19 09:39:05', 4, 4444.00, 17776.00),
(11, 5, '2026-05-19 09:39:09', 4, 4.00, 16.00),
(12, 5, '2026-05-19 09:39:13', 4, 4.00, 16.00),
(13, 5, '2026-05-19 09:39:18', 4, 4.00, 16.00),
(14, 4, '2026-05-19 09:39:27', 4, 4.00, 16.00);

-- --------------------------------------------------------

--
-- Table structure for table `productout`
--

CREATE TABLE `productout` (
  `ProductOutId` int(11) NOT NULL,
  `ProductCode` int(11) NOT NULL,
  `Date` timestamp NOT NULL DEFAULT current_timestamp(),
  `Quantity` int(11) DEFAULT 0,
  `UnitPrice` decimal(10,2) NOT NULL,
  `TotalPrice` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productout`
--

INSERT INTO `productout` (`ProductOutId`, `ProductCode`, `Date`, `Quantity`, `UnitPrice`, `TotalPrice`) VALUES
(17, 3, '2026-05-19 08:35:44', 2, 1000.00, 2000.00),
(18, 5, '2026-05-19 09:33:13', 2, 3000.00, 6000.00),
(19, 3, '2026-05-19 09:34:03', 1, 2000.00, 2000.00);

-- --------------------------------------------------------

--
-- Table structure for table `shopkeeper`
--

CREATE TABLE `shopkeeper` (
  `ShopkeeperId` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shopkeeper`
--

INSERT INTO `shopkeeper` (`ShopkeeperId`, `username`, `password`, `created_at`) VALUES
(1, 'amani', '$2b$10$WYIa3rfw8PIUOuCobhhiAejYN0WwWmIrRPBKGjfi1nI8fLGneOdHK', '2026-05-19 07:59:12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`ProductCode`),
  ADD UNIQUE KEY `ProductName` (`ProductName`);

--
-- Indexes for table `productin`
--
ALTER TABLE `productin`
  ADD PRIMARY KEY (`ProductInId`),
  ADD KEY `ProductCode` (`ProductCode`);

--
-- Indexes for table `productout`
--
ALTER TABLE `productout`
  ADD PRIMARY KEY (`ProductOutId`),
  ADD KEY `ProductCode` (`ProductCode`);

--
-- Indexes for table `shopkeeper`
--
ALTER TABLE `shopkeeper`
  ADD PRIMARY KEY (`ShopkeeperId`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `ProductCode` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `productin`
--
ALTER TABLE `productin`
  MODIFY `ProductInId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `productout`
--
ALTER TABLE `productout`
  MODIFY `ProductOutId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `shopkeeper`
--
ALTER TABLE `shopkeeper`
  MODIFY `ShopkeeperId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `productin`
--
ALTER TABLE `productin`
  ADD CONSTRAINT `productin_ibfk_1` FOREIGN KEY (`ProductCode`) REFERENCES `product` (`ProductCode`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `productout`
--
ALTER TABLE `productout`
  ADD CONSTRAINT `productout_ibfk_1` FOREIGN KEY (`ProductCode`) REFERENCES `product` (`ProductCode`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
