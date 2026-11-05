-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 10, 2026 at 12:41 PM
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
-- Database: `brsc_mpr`
--

-- --------------------------------------------------------

--
-- Table structure for table `emerging_tech_types`
--

CREATE TABLE `emerging_tech_types` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `emerging_tech_types`
--

INSERT INTO `emerging_tech_types` (`id`, `name`) VALUES
(1, 'Artificial Intelligence (AI)'),
(2, 'Augmented Reality (AR) / Virtual Reality (VR)'),
(3, 'Blockchain'),
(5, 'Drone'),
(4, 'Internet of Things (IoT)');

-- --------------------------------------------------------

--
-- Table structure for table `mpr_emerging_tech`
--

CREATE TABLE `mpr_emerging_tech` (
  `id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `tech_type` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `link_url` text DEFAULT NULL,
  `project_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mpr_major_awards`
--

CREATE TABLE `mpr_major_awards` (
  `id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `award_level` varchar(50) DEFAULT NULL,
  `award_title` varchar(100) DEFAULT NULL,
  `award_date` date DEFAULT NULL,
  `details_of_award` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mpr_major_events`
--

CREATE TABLE `mpr_major_events` (
  `id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `event_name` text NOT NULL,
  `project` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `date_of_event` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mpr_national_product_inputs`
--

CREATE TABLE `mpr_national_product_inputs` (
  `id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `parameter_id` int(11) NOT NULL,
  `previous_month` varchar(100) DEFAULT NULL,
  `reporting_month` varchar(100) DEFAULT NULL,
  `cumulative_since_inception` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mpr_reports`
--

CREATE TABLE `mpr_reports` (
  `id` int(11) NOT NULL,
  `month_year` varchar(20) NOT NULL,
  `prism_project_id` int(11) DEFAULT NULL,
  `project_name` varchar(255) DEFAULT NULL,
  `submission_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(20) DEFAULT 'Submitted',
  `report_month` varchar(20) DEFAULT 'March',
  `report_year` int(11) DEFAULT 2026,
  `other_significant` text DEFAULT NULL,
  `enhancement_done` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `national_products`
--

CREATE TABLE `national_products` (
  `id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `national_products`
--

INSERT INTO `national_products` (`id`, `product_name`) VALUES
(5, 'CONFONET'),
(10, 'e-Office'),
(11, 'e-Office (Bihar Sparrow)'),
(3, 'e-Prisons'),
(6, 'e-Transport'),
(8, 'eCourts'),
(1, 'ICJS'),
(2, 'Immigration, Visa and Foreigner\'s Registration & Tracking (IVFRT)'),
(9, 'NKN'),
(7, 'RCH'),
(4, 'Targeted PDS');

-- --------------------------------------------------------

--
-- Table structure for table `national_product_parameters`
--

CREATE TABLE `national_product_parameters` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `parameter_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `national_product_parameters`
--

INSERT INTO `national_product_parameters` (`id`, `product_id`, `parameter_name`) VALUES
(1, 1, 'Centralised FIR Collection System'),
(2, 1, 'FSL Site Implemented'),
(3, 1, 'e-Prosecution site implemented'),
(4, 2, 'Number of Indian Missions Abroad'),
(5, 2, 'Number of Immigration Check Posts'),
(6, 2, 'Number of Foreigners Registration Offices in the State'),
(7, 2, 'Number of Visa issued (Visa Extension)'),
(8, 2, 'Number of C-Visa/E-Visa implemented at Gaya Airport'),
(9, 3, 'Number of Prisoners registered (As per new Registration)'),
(10, 3, 'Number of Jails'),
(11, 3, 'Number of Cases'),
(12, 4, 'No. of RC Digitized'),
(13, 4, 'No. of FPS Automated'),
(14, 5, 'No. of consumer commissions'),
(15, 5, 'No. of locations where operational'),
(16, 5, 'No. of locations where OCMS'),
(17, 5, 'Cases Filed updated'),
(18, 5, 'Cases Disposed on OCMS'),
(19, 6, 'No. of Registered Vehicles'),
(20, 6, 'No. of Transactions'),
(21, 6, 'No. of DL issued by Sarathi 4.0'),
(22, 7, 'No. of registered Eligible Couple'),
(23, 7, 'No. of registered Children'),
(24, 7, 'No. of registered Pregnant Women'),
(25, 8, 'No. of District Covered'),
(26, 8, 'No. of Courts'),
(27, 8, 'No. of Pending Cases'),
(28, 8, 'No. of orders and judgement.'),
(29, 9, 'Number of Institutes Connected'),
(30, 9, 'Number of Virtual Classrooms'),
(31, 9, 'International PoPs'),
(32, 9, 'Number of District Links'),
(33, 9, 'Number of Migrated Links'),
(34, 10, 'No. of e-Files created'),
(35, 10, 'No. of Depts.'),
(36, 10, 'No. of Districts'),
(37, 10, 'No. of Subsidiaries Units'),
(38, 10, 'Total Users'),
(39, 11, 'No. of e-PAR created'),
(40, 11, 'No. of Depts.'),
(41, 11, 'No. of cadre services'),
(42, 11, 'Total Users');

-- --------------------------------------------------------

--
-- Table structure for table `prism_projects`
--

CREATE TABLE `prism_projects` (
  `id` int(11) NOT NULL,
  `prism_id` varchar(50) NOT NULL,
  `project_name` varchar(255) NOT NULL,
  `department` text DEFAULT NULL,
  `default_url` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `project_description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `emerging_tech_types`
--
ALTER TABLE `emerging_tech_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `mpr_emerging_tech`
--
ALTER TABLE `mpr_emerging_tech`
  ADD PRIMARY KEY (`id`),
  ADD KEY `report_id` (`report_id`);

--
-- Indexes for table `mpr_major_awards`
--
ALTER TABLE `mpr_major_awards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `report_id` (`report_id`);

--
-- Indexes for table `mpr_major_events`
--
ALTER TABLE `mpr_major_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `report_id` (`report_id`);

--
-- Indexes for table `mpr_national_product_inputs`
--
ALTER TABLE `mpr_national_product_inputs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `report_id` (`report_id`);

--
-- Indexes for table `mpr_reports`
--
ALTER TABLE `mpr_reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `national_products`
--
ALTER TABLE `national_products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_name` (`product_name`);

--
-- Indexes for table `national_product_parameters`
--
ALTER TABLE `national_product_parameters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `prism_projects`
--
ALTER TABLE `prism_projects`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `emerging_tech_types`
--
ALTER TABLE `emerging_tech_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `mpr_emerging_tech`
--
ALTER TABLE `mpr_emerging_tech`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `mpr_major_awards`
--
ALTER TABLE `mpr_major_awards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `mpr_major_events`
--
ALTER TABLE `mpr_major_events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `mpr_national_product_inputs`
--
ALTER TABLE `mpr_national_product_inputs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `mpr_reports`
--
ALTER TABLE `mpr_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `national_products`
--
ALTER TABLE `national_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `national_product_parameters`
--
ALTER TABLE `national_product_parameters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `prism_projects`
--
ALTER TABLE `prism_projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `mpr_emerging_tech`
--
ALTER TABLE `mpr_emerging_tech`
  ADD CONSTRAINT `mpr_emerging_tech_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `mpr_reports` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `mpr_major_awards`
--
ALTER TABLE `mpr_major_awards`
  ADD CONSTRAINT `mpr_major_awards_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `mpr_reports` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `mpr_major_events`
--
ALTER TABLE `mpr_major_events`
  ADD CONSTRAINT `mpr_major_events_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `mpr_reports` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `mpr_national_product_inputs`
--
ALTER TABLE `mpr_national_product_inputs`
  ADD CONSTRAINT `mpr_national_product_inputs_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `mpr_reports` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `national_product_parameters`
--
ALTER TABLE `national_product_parameters`
  ADD CONSTRAINT `national_product_parameters_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `national_products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
