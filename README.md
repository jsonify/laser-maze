# Laser Maze Web Application

## Game Overview

**Title:** Laser Maze
**Genre:** Logic Puzzle Game
**Platform:** Web Application (Browser-based)
**Target Audience:** 8+ years old, puzzle enthusiasts

## Game Concept

Laser Maze is a digital adaptation of the physical board game by ThinkFun. Players strategically place mirrors, beam splitters, and other optical elements on a grid to guide a laser beam and activate targets. The game is designed to challenge spatial reasoning, planning skills, and understanding of basic optics principles.

## System Architecture

The application is built using a component-based architecture with React, structured into the following layers:

- **Presentation Layer:**  Handles UI rendering using React components, styled with CSS/Tailwind, and enhanced with animation libraries for visual effects.
- **Game Logic Layer:** Manages the game state, simulates laser physics, handles token interactions, and checks win conditions.
- **Data Layer:**  Responsible for storing challenge data, user progress, and settings.

### Component Structure

The project is organized into components, hooks, contexts, utils, and data directories, as detailed in the comprehensive design document. Key components include:

- `GameBoard`: The main game grid component.
- `TokenPalette`: Displays available tokens for placement.
- `LaserBeam`: Visualizes the laser path.
- `ChallengePicker`: UI for selecting game challenges.

For a detailed component breakdown, please refer to the [comprehensive design document](laser-maze-comprehensive-design.md).

## Core Technical Components

- **Grid System:** A 2D array representing the game board, where each cell can contain token data.
- **Token System:** Implemented as React components, each token type has unique properties like visual representation, interaction logic, and rotation state.
- **Laser Physics Engine:**  Calculates the laser beam path, handling reflections, splitting, and target activation based on token interactions.
- **Challenge System:** Defines the structure for game challenges, including grid layouts, token sets, and win conditions, loaded from JSON data.

## Core Gameplay Implementation

- **Objective & Win Condition:** Players must direct the laser to activate a specific number of targets by strategically placing and orienting tokens. The game checks for win conditions by simulating the laser path and verifying target activation and checkpoint hits.
- **User Interaction System:** Utilizes drag-and-drop for token placement and click interactions for token rotation, providing an intuitive user experience.

## Technical Implementation Details

- **Rendering System:** Employs React's rendering capabilities, with Canvas for laser beams and SVGs for tokens, optimized for performance and visual clarity.
- **Performance Considerations:** Includes memoization, component optimization, and lazy loading to ensure smooth gameplay.
- **Storage Implementation:** Leverages local storage to persist user progress and settings.

## Progression and Hint System

The game features a progressive unlock system, allowing players to advance through difficulty levels. A hint system is implemented to guide players, offering progressive hints and a solution viewer when needed.

## Future Enhancements

Planned future enhancements include:

- Challenge Editor for user-created levels.
- Multiplayer Mode for competitive gameplay.
- Educational Features to integrate optics learning.

For a complete overview of the game design and architecture, please refer to the [laser-maze-comprehensive-design.md](laser-maze-comprehensive-design.md) file.