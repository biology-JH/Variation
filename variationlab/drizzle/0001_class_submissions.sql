CREATE TABLE `class_submissions` (
  `id` varchar(36) NOT NULL,
  `bodyMass` decimal(7,2),
  `height` decimal(7,2),
  `handSpan` decimal(6,2),
  `tongueRolling` enum('can','cannot'),
  `eyeColour` enum('brown','blue','green','hazel'),
  `bloodGroup` enum('A','B','AB','O'),
  `leafLengths` text,
  `seedMass` decimal(8,4),
  `submittedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
