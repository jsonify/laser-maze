# Laser Maze: Comprehensive Game Design & Architecture Document

## 1. Game Overview

**Title:** Laser Maze
**Genre:** Logic Puzzle Game
**Platform:** Web Application (Browser-based)
**Target Audience:** 8+ years old, puzzle enthusiasts

## 2. Game Concept

Laser Maze is a digital adaptation of the physical board game by ThinkFun. Players arrange mirrors, beam splitters, and other optical elements on a grid to direct a laser beam to activate target(s). The game challenges spatial reasoning, planning, and understanding of basic optics principles.

## 3. System Architecture

### 3.1 High-Level Architecture

The application will follow a component-based architecture using React with the following layers:

1. **Presentation Layer**
   - React components for UI rendering
   - CSS/Tailwind for styling
   - Animation libraries for visual effects

2. **Game Logic Layer**
   - Game state management
   - Laser physics simulation
   - Token interaction logic
   - Win condition checking

3. **Data Layer**
   - Challenge data storage
   - User progress persistence
   - Settings storage

### 3.2 Component Structure

```
LaserMazeApp/
├── components/
│   ├── App.jsx                 # Root component
│   ├── GameBoard.jsx           # Main game grid
│   ├── Cell.jsx                # Individual grid cell
│   ├── tokens/                 # Token components
│   │   ├── Laser.jsx
│   │   ├── Target.jsx
│   │   ├── TargetMirror.jsx
│   │   ├── Mirror.jsx
│   │   ├── DoubleМirror.jsx
│   │   ├── BeamSplitter.jsx
│   │   ├── Checkpoint.jsx
│   │   └── CellBlocker.jsx
│   ├── LaserBeam.jsx           # Laser beam visualization
│   ├── TokenPalette.jsx        # Available tokens display
│   ├── ChallengeInfo.jsx       # Challenge details
│   ├── Controls.jsx            # Game controls (fire laser, reset)
│   ├── HintSystem.jsx          # Progressive hint interface
│   └── ChallengePicker.jsx     # Challenge selection UI
├── hooks/
│   ├── useGameState.js         # Game state management
│   ├── useLaserSimulation.js   # Laser physics calculations
│   ├── useChallengeData.js     # Challenge loading & processing
│   ├── useProgressTracking.js  # User progress management
│   └── useHintSystem.js        # Hint functionality
├── contexts/
│   ├── GameContext.js          # Global game state context
│   └── SettingsContext.js      # User settings context
├── utils/
│   ├── laserPhysics.js         # Core physics algorithms
│   ├── tokenInteraction.js     # Token behavior definitions
│   ├── challengeValidator.js   # Solution checking
│   └── progressManager.js      # Level unlocking logic
└── data/
    ├── challenges/             # Challenge definitions by level
    │   ├── beginner.json       # Challenges 1-15
    │   ├── intermediate.json   # Challenges 16-31
    │   ├── advanced.json       # Challenges 32-45
    │   └── expert.json         # Challenges 46-60
    ├── tokens.json             # Token type definitions
    └── settings.js             # Default settings
```

### 3.3 State Management

The application will use React's Context API and custom hooks for state management:

1. **GameContext**: Manages the game's core state:
   - Current challenge
   - Grid state (token positions and orientations)
   - Selected token
   - Laser path
   - Game status (in progress, won)

2. **SettingsContext**: Manages user preferences:
   - Sound settings
   - Visual effects settings
   - Accessibility options

### 3.4 Data Flow

```
User Action → React Component → State Update → 
Game Logic Processing → UI Update → Rendered View
```

## 4. Core Technical Components

### 4.1 Grid System

**Implementation:**
- 2D array representation (typically 5×5)
- Each cell contains token data or null
- Token data includes type, orientation, and state

```javascript
// Example grid data structure
const grid = [
  [null, null, { type: 'laser', rotation: 0, movable: false, rotatable: false }, null, null],
  [null, null, null, null, null],
  [null, { type: 'mirror', rotation: 90, movable: false, rotatable: false }, null, null, null],
  [null, null, null, { type: 'target', rotation: 0, activated: false, movable: false, rotatable: false }, null],
  [null, null, null, null, null]
];
```

### 4.2 Token System

Each token type will be implemented as a separate component with the following properties:
- Type identifier
- Visual representation
- Interaction logic with laser
- Rotation state
- Movability flags (fixed, rotatable only, or fully movable)

```javascript
// Token type definitions with rotation properties
const tokenTypes = {
  "laser": {
    rotatable: false,
    orientations: [0, 90, 180, 270], // Direction the laser points
    fixed: true // Fixed position on initial board
  },
  "target-mirror": {
    rotatable: true,
    orientations: [0, 90, 180, 270], 
    // 0 = target on bottom, mirror on other sides
    // 90 = target on left, mirror on other sides
    // 180 = target on top, mirror on other sides
    // 270 = target on right, mirror on other sides
    dual: true // Has two functions depending on orientation
  },
  "mirror": {
    rotatable: true,
    orientations: [45, 135, 225, 315], // Diagonal orientations
    reflective: true
  },
  "beam-splitter": {
    rotatable: true,
    orientations: [0, 90, 180, 270],
    splitting: true
  },
  "checkpoint": {
    rotatable: false,
    orientations: [0], // Single orientation
    mustHit: true
  },
  "cell-blocker": {
    rotatable: false,
    orientations: [0], // Single orientation
    blocks: true
  }
}
```

Token interactions will be managed by a dedicated module that handles how each token affects the laser beam.

### 4.3 Laser Physics Engine

The core of the game is the laser physics simulation, which will:

1. Calculate the complete path of the laser beam
2. Handle reflections, splitting, and other interactions
3. Detect when targets are hit
4. Verify win conditions

**Algorithm Overview:**
```javascript
function calculateLaserPath(grid, startPosition, startDirection) {
  const path = [];
  const activatedTargets = [];
  let currentPosition = startPosition;
  let currentDirection = startDirection;
  let beams = [{ position: currentPosition, direction: currentDirection }];
  let visitedCells = new Set(); // Prevent infinite loops
  
  while (beams.length > 0) {
    const beam = beams.shift();
    let { position, direction } = beam;
    
    // Move in current direction
    position = moveInDirection(position, direction);
    
    // Check if beam is out of bounds
    if (!isInBounds(position, grid.length)) {
      continue;
    }
    
    // Add to path
    path.push({ 
      start: moveInDirection(position, (direction + 180) % 360),
      end: position 
    });
    
    const cellKey = `${position.row},${position.col},${direction}`;
    if (visitedCells.has(cellKey)) {
      continue; // Prevent infinite loops
    }
    visitedCells.add(cellKey);
    
    // Get token at current position
    const token = grid[position.row][position.col];
    
    if (token) {
      // Process interaction with token
      const interaction = processLaserInteraction({ direction }, token);
      
      switch (interaction.action) {
        case "ACTIVATE":
          activatedTargets.push(position);
          break;
        case "REFLECT":
        case "SPLIT":
          beams.push(...interaction.newBeams);
          break;
        case "BLOCK":
          // Beam stops
          break;
        case "CONTINUE":
          beams.push({ position, direction });
          break;
      }
    } else {
      // Continue in same direction
      beams.push({ position, direction });
    }
  }
  
  return { path, activatedTargets };
}

// Laser-token interaction logic
function processLaserInteraction(beam, token) {
  const { type, orientation } = token;
  
  switch(type) {
    case "target-mirror":
      // Check if the beam hits the target side or mirror side
      if (isTargetSideHit(beam.direction, orientation)) {
        return { action: "ACTIVATE", newBeams: [] };
      } else {
        // Mirror reflection logic
        return { action: "REFLECT", newBeams: [calculateReflection(beam, orientation)] };
      }
      
    case "mirror":
      // 45° angle mirror reflection
      return { action: "REFLECT", newBeams: [calculateReflection(beam, orientation)] };
      
    case "beam-splitter":
      // Creates two beams at 90° angles
      return { 
        action: "SPLIT", 
        newBeams: [
          calculateSplitBeam1(beam, orientation),
          calculateSplitBeam2(beam, orientation)
        ]
      };
      
    case "checkpoint":
      // Pass through but must be hit
      return { action: "CONTINUE", newBeams: [beam] };
      
    case "cell-blocker":
      // Stops beam
      return { action: "BLOCK", newBeams: [] };
      
    case "target":
      // Activates target
      return { action: "ACTIVATE", newBeams: [] };
      
    default:
      return { action: "CONTINUE", newBeams: [beam] };
  }
}

// Helper to determine if the target side of a dual-purpose token is hit
function isTargetSideHit(beamDirection, tokenOrientation) {
  // orientation 0 = target on bottom
  // orientation 90 = target on left
  // orientation 180 = target on top
  // orientation 270 = target on right
  
  // Check if beam direction opposes target direction
  return ((tokenOrientation === 0 && beamDirection === 180) ||
          (tokenOrientation === 90 && beamDirection === 270) ||
          (tokenOrientation === 180 && beamDirection === 0) ||
          (tokenOrientation === 270 && beamDirection === 90));
}
```

### 4.4 Challenge System

**Challenge Data Structure:**
```javascript
{
  "id": "26",
  "level": "intermediate",
  "gridSize": 5,
  "requiredTargets": 1,
  
  // Fixed tokens that cannot be moved or rotated
  "fixedTokens": [
    { type: "cell-blocker", position: { row: 2, col: 2 }, orientation: 0, movable: false, rotatable: false },
    { type: "mirror", position: { row: 3, col: 2 }, orientation: 135, movable: false, rotatable: false },
    { type: "laser", position: { row: 3, col: 3 }, orientation: 0, movable: false, rotatable: false }
  ],
  
  // Tokens with predetermined positions but unknown orientations
  "rotationTokens": [
    { type: "target-mirror", position: { row: 3, col: 4 }, orientation: "?", movable: false, rotatable: true }
  ],
  
  // Tokens that need to be added to the grid by the player
  "addTokens": [
    { type: "target-mirror", count: 3, movable: true, rotatable: true }
  ],
  
  // Official solution data
  "solution": {
    "placedTokens": [
      { type: "target-mirror", position: { row: 0, col: 1 }, orientation: 270 },
      { type: "target-mirror", position: { row: 1, col: 3 }, orientation: 180 },
      { type: "target-mirror", position: { row: 3, col: 4 }, orientation: 270 }
    ],
    "laserPath": [
      // Complete path representation for solution verification
    ]
  },
  
  // Hint system data
  "hints": [
    { level: 1, text: "Focus on placing your first token to redirect the laser upward." },
    { level: 2, text: "Try placing a target-mirror at position (0,1) with the target facing down." },
    { level: 3, partial: ["target-mirror", { row: 0, col: 1 }, 270] }
  ]
}
```

## 5. Core Gameplay Implementation

### 5.1 Objective & Win Condition

The win condition checking algorithm:
```javascript
function checkWinCondition(gameState, challenge) {
  const { grid } = gameState;
  const { requiredTargets } = challenge;
  
  // Calculate laser path
  const laserToken = findLaserToken(grid);
  const { path, activatedTargets } = calculateLaserPath(
    grid, 
    laserToken.position, 
    laserToken.orientation
  );
  
  // Check if the right number of targets are activated
  if (activatedTargets.length !== requiredTargets) {
    return false;
  }
  
  // Check if all required checkpoints are hit
  const checkpoints = findTokensByType(grid, "checkpoint");
  for (const checkpoint of checkpoints) {
    if (!isPositionInPath(checkpoint.position, path)) {
      return false;
    }
  }
  
  // Check if all required tokens are placed on the grid
  const requiredTokenCount = getTotalRequiredTokens(challenge);
  const placedTokenCount = countPlacedTokens(grid, challenge.addTokens);
  if (placedTokenCount !== requiredTokenCount) {
    return false;
  }
  
  return true;
}
```

### 5.2 User Interaction System

The game will use drag-and-drop for token placement and click for rotation:

```javascript
// Drag start handler
function handleDragStart(e, token, fromPalette = false, index = null) {
  e.dataTransfer.setData('token', JSON.stringify({
    token,
    fromPalette,
    index
  }));
}

// Drop handler
function handleDrop(e, cellPosition) {
  e.preventDefault();
  const data = JSON.parse(e.dataTransfer.getData('token'));
  const { token, fromPalette, index } = data;
  
  // Check if cell is empty
  if (boardState.grid[cellPosition.row][cellPosition.col]) {
    return; // Cell already occupied
  }
  
  // Update board state
  const newState = { ...boardState };
  
  // Place token on grid
  newState.grid[cellPosition.row][cellPosition.col] = {
    ...token,
    position: cellPosition
  };
  
  // Remove from palette if it came from there
  if (fromPalette) {
    newState.palette[token.type] -= 1;
  } else {
    // Remove from previous position if moved on grid
    const { position } = token;
    newState.grid[position.row][position.col] = null;
  }
  
  setBoardState(newState);
  
  // Check if solved
  checkSolution(newState.grid, challenge, onSolve);
}

// Rotation handler
function handleRotate(position) {
  const token = boardState.grid[position.row][position.col];
  
  if (!token || !token.rotatable) {
    return; // Cannot rotate this token
  }
  
  // Get next orientation in the sequence
  const tokenDef = tokenTypes[token.type];
  const currentIndex = tokenDef.orientations.indexOf(token.orientation);
  const nextIndex = (currentIndex + 1) % tokenDef.orientations.length;
  const newOrientation = tokenDef.orientations[nextIndex];
  
  // Update the token orientation
  const newState = { ...boardState };
  newState.grid[position.row][position.col] = {
    ...token,
    orientation: newOrientation
  };
  
  setBoardState(newState);
  
  // Check if solved
  checkSolution(newState.grid, challenge, onSolve);
}
```

### 5.3 Challenge Card System

Challenge cards will be loaded from a data source and parsed into the game state. The implementation will:
- Load challenge data based on selected difficulty and number
- Set up the initial grid state with fixed tokens
- Populate the token palette with required tokens
- Track the required number of targets

### 5.4 Difficulty Progression

The challenge data will be organized by difficulty levels, with progressive complexity:
- **Beginner (Cards #1-15)**: Simpler token arrangements, fewer question marks
- **Intermediate (Cards #16-31)**: More complex, more orientation decisions
- **Advanced (Cards #32-45)**: Advanced configurations, multiple targets
- **Expert (Cards #46-60)**: Maximum complexity, many orientation decisions

## 6. Technical Implementation Details

### 6.1 Rendering System

The game will use React's component-based rendering with specific optimizations:
- Canvas-based rendering for the laser beam for performance
- SVG-based token visualization for crisp scaling
- CSS transitions and animations for smooth interactions

```jsx
// LaserBeam component for visualizing the laser path
const LaserBeam = ({ path, animationSpeed = 100 }) => {
  const [visibleSegments, setVisibleSegments] = useState([]);
  
  // Animate the laser beam propagation
  useEffect(() => {
    if (!path || path.length === 0) {
      setVisibleSegments([]);
      return;
    }
    
    setVisibleSegments([]);
    const timer = setInterval(() => {
      setVisibleSegments(prev => {
        if (prev.length >= path.length) {
          clearInterval(timer);
          return prev;
        }
        return [...prev, path[prev.length]];
      });
    }, animationSpeed);
    
    return () => clearInterval(timer);
  }, [path, animationSpeed]);
  
  return (
    <svg className="laser-beam-layer" viewBox="0 0 5 5">
      {visibleSegments.map((segment, index) => (
        <line
          key={`segment-${index}`}
          x1={segment.start.col + 0.5}
          y1={segment.start.row + 0.5}
          x2={segment.end.col + 0.5}
          y2={segment.end.row + 0.5}
          stroke="#ff0000"
          strokeWidth="0.1"
          strokeOpacity="0.8"
        />
      ))}
      
      {/* Highlight activated targets */}
      {path.activatedTargets && path.activatedTargets.map((target, index) => (
        <circle
          key={`target-${index}`}
          cx={target.col + 0.5}
          cy={target.row + 0.5}
          r="0.2"
          fill="#ff9900"
          className="target-activated-glow"
        />
      ))}
    </svg>
  );
};
```

### 6.2 Event Handling

```
User Events:
- Token Selection: Update selectedToken state
- Token Drag: Start drag operation with token data
- Token Drop: Place token at grid position
- Cell Click: Rotate token if present and rotatable
- Fire Laser Button: Trigger laser simulation
- Reset Button: Reset grid to initial challenge state
- Next Hint Button: Reveal next hint level
- View Solution Button: Show complete solution
```

### 6.3 Performance Considerations

- Memoize expensive calculations (laser path)
- Use React.memo for pure components
- Optimize re-renders with useMemo and useCallback
- Batch state updates where possible
- Lazy load challenge data by difficulty level

### 6.4 Storage Implementation

**Local Storage Schema:**
```javascript
{
  "laserMazeProgress": {
    "completedChallenges": ["beginner-1", "beginner-2", ...],
    "unlockedLevels": ["beginner", "intermediate"],
    "currentLevel": "intermediate",
    "currentChallenge": 16
  },
  "laserMazeSettings": {
    "soundEnabled": true,
    "animationSpeed": "normal",
    "highContrast": false
  }
}
```

## 7. User Interface Architecture

### 7.1 Component Hierarchy

```
App
├── Header
├── ChallengePicker
│   └── ChallengeCard
├── GameScreen
│   ├── ChallengeInfo
│   ├── GameBoard
│   │   ├── Cell
│   │   │   └── Token
│   │   └── LaserBeam
│   ├── TokenPalette
│   │   └── Token
│   ├── Controls
│   └── HintSystem
│       ├── HintDisplay
│       └── SolutionViewer
└── Footer
```

### 7.2 Challenge Selection UI

```jsx
const ChallengePicker = ({ onSelectChallenge }) => {
  const { progress } = useProgressTracking();
  
  return (
    <div className="challenge-picker">
      <h2>Select Challenge</h2>
      
      {progress.unlockedLevels.map(level => (
        <div key={level} className="challenge-level">
          <h3 className={`level-header level-${level}`}>{level.charAt(0).toUpperCase() + level.slice(1)}</h3>
          
          <div className="challenge-grid">
            {Array.from({ length: getLevelChallengeCount(level) }).map((_, i) => {
              const challengeNumber = i + 1;
              const isCompleted = progress.completedChallenges.includes(`${level}-${challengeNumber}`);
              
              return (
                <button
                  key={challengeNumber}
                  className={`challenge-button ${isCompleted ? 'completed' : ''}`}
                  onClick={() => onSelectChallenge(level, challengeNumber)}
                >
                  {challengeNumber}
                  {isCompleted && <span className="completed-check">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
```

### 7.3 Responsive Design

The UI will adapt to different screen sizes with these breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

Key responsive considerations:
- Grid size scaling based on viewport
- Touch-friendly controls for mobile
- Alternative layouts for narrow screens

## 8. Progression and Hint System

### 8.1 Progressive Unlock System

```javascript
const useProgressTracking = () => {
  // Load saved progress from localStorage
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('laserMazeProgress');
    return saved ? JSON.parse(saved) : {
      completedChallenges: [],
      unlockedLevels: ["beginner"],
      currentLevel: "beginner",
      currentChallenge: 1
    };
  });
  
  // Mark challenge as completed
  const completeChallenge = useCallback((level, number) => {
    const challengeId = `${level}-${number}`;
    
    if (!progress.completedChallenges.includes(challengeId)) {
      const newProgress = {
        ...progress,
        completedChallenges: [...progress.completedChallenges, challengeId]
      };
      
      // Unlock next level if appropriate
      if (level === "beginner" && number >= 15 && !newProgress.unlockedLevels.includes("intermediate")) {
        newProgress.unlockedLevels = [...newProgress.unlockedLevels, "intermediate"];
      } else if (level === "intermediate" && number >= 31 && !newProgress.unlockedLevels.includes("advanced")) {
        newProgress.unlockedLevels = [...newProgress.unlockedLevels, "advanced"];
      } else if (level === "advanced" && number >= 45 && !newProgress.unlockedLevels.includes("expert")) {
        newProgress.unlockedLevels = [...newProgress.unlockedLevels, "expert"];
      }
      
      setProgress(newProgress);
      localStorage.setItem('laserMazeProgress', JSON.stringify(newProgress));
    }
  }, [progress]);
  
  return { progress, completeChallenge };
};
```

### 8.2 Hint System Implementation

```javascript
const useHintSystem = (challenge) => {
  const [hintLevel, setHintLevel] = useState(0);
  const [showingSolution, setShowingSolution] = useState(false);
  
  // Get current available hint
  const currentHint = useMemo(() => {
    if (!challenge || !challenge.hints || hintLevel === 0) {
      return null;
    }
    
    return challenge.hints[Math.min(hintLevel - 1, challenge.hints.length - 1)];
  }, [challenge, hintLevel]);
  
  // Advance to next hint
  const nextHint = useCallback(() => {
    if (challenge && challenge.hints && hintLevel < challenge.hints.length) {
      setHintLevel(level => level + 1);
    }
  }, [challenge, hintLevel]);
  
  // Show complete solution
  const showSolution = useCallback(() => {
    setShowingSolution(true);
  }, []);
  
  return { 
    currentHint, 
    nextHint, 
    showSolution, 
    showingSolution,
    hasMoreHints: challenge?.hints && hintLevel < challenge.hints.length
  };
};
```

### 8.3 Solution Viewer

```jsx
const SolutionViewer = ({ challenge, onClose }) => {
  const solution = challenge?.solution;
  
  if (!solution) return null;
  
  return (
    <div className="solution-viewer">
      <h3>Solution</h3>
      
      <div className="solution-grid">
        {/* Render the grid with the solution token placements */}
        {renderSolutionGrid(solution.placedTokens, challenge.gridSize)}
        
        {/* Render the laser path overlay */}
        <LaserBeam path={solution.laserPath} animationSpeed={50} />
      </div>
      
      <button onClick={onClose}>Close Solution</button>
    </div>
  );
};
```

## 9. Testing Architecture

### 9.1 Unit Testing

- Jest for component and utility testing
- React Testing Library for component interaction testing
- Test coverage for core logic modules:
  * Laser physics engine
  * Token interaction system
  * Win condition checking

### 9.2 Integration Testing

- Test complete challenge solutions
- Verify game flow from selection to completion
- Test edge cases in token interactions

### 9.3 User Testing

- Playtest protocol for difficulty calibration
- Accessibility testing for screen readers
- Cross-browser and cross-device testing

## 10. Deployment Architecture

### 10.1 Build System

- Webpack for bundling
- Babel for transpilation
- PostCSS for CSS processing
- Environment-specific configurations

### 10.2 Hosting

- Static site hosting (GitHub Pages, Netlify, Vercel)
- CDN for asset delivery
- Optional backend for user progress syncing (Firebase, Supabase)

### 10.3 CI/CD Pipeline

```
Code Commit → Automated Tests → Build → Preview → Deploy
```

## 11. Expansion Architecture

The architecture is designed to accommodate future expansions:

### 11.1 Challenge Editor

- Component reuse from main game
- JSON export/import of custom challenges
- Validation system for playability

### 11.2 Multiplayer Mode

- WebSocket integration for real-time competition
- Leaderboard system
- Challenge sharing

## 12. Security Considerations

- Input validation for custom challenges
- Rate limiting for multiplayer features
- Content security policy implementation
- Local storage encryption for progress data

## 13. Accessibility Architecture

- ARIA attributes for screen readers
- Keyboard navigation support
- High contrast mode
- Configurable animation settings
- Color-blind friendly token designs

## 14. Visual Design Reference

### 14.1 Token Color Scheme
Based on the physical game:
- Laser: Red
- Target/Mirror: Purple with red target side
- Mirror: Blue
- Beam Splitter: Green
- Checkpoint: Yellow/Orange
- Cell Blocker: Black/Gray

### 14.2 Challenge Card Layout
Format follows the physical cards with:
- Header: Game title, difficulty level, challenge number
- Top section: "ADD TO GRID" tokens with question marks for orientation
- Middle section: Grid layout with fixed tokens
- Right corner: "# OF TARGETS" indicator (number in red circle)
- Bottom: Difficulty level color-coded (Green/Orange/Blue/Red)

### 14.3 Grid Visualization
- 5×5 grid for standard challenges
- Clear cell boundaries
- Visual indicators for token orientation
- Animated laser path with glow effect

## 15. Challenge Data Storage Strategy

### 15.1 File Organization

```
src/
├── data/
│   ├── challenges/
│   │   ├── beginner.json     # Challenges 1-15
│   │   ├── intermediate.json # Challenges 16-31
│   │   ├── advanced.json     # Challenges 32-45
│   │   └── expert.json       # Challenges 46-60
│   └── tokens.json           # Token definitions
```

### 15.2 Challenge Data Structure

```javascript
// Example challenge data structure
{
  "beginner": [
    {
      "id": "1",
      "level": "beginner",
      "gridSize": 5,
      "requiredTargets": 1,
      "fixedTokens": [
        { "type": "laser", "position": { "row": 2, "col": 0 }, "orientation": 90, "movable": false, "rotatable": false },
        { "type": "target", "position": { "row": 0, "col": 4 }, "orientation": 0, "movable": false, "rotatable": false }
      ],
      "rotationTokens": [],
      "addTokens": [
        { "type": "mirror", "count": 2, "movable": true, "rotatable": true }
      ],
      "solution": {
        "placedTokens": [
          { "type": "mirror", "position": { "row": 1, "col": 2 }, "orientation": 135 },
          { "type": "mirror", "position": { "row": 0, "col": 2 }, "orientation": 225 }
        ],
        "laserPath": [
          // Complete path representation
        ]
      },
      "hints": [
        { "level": 1, "text": "You need to use both mirrors to redirect the laser beam." },
        { "level": 2, "text": "Try placing one mirror at position (1,2)." },
        { "level": 3, "partial": ["mirror", { "row": 1, "col": 2 }, 135] }
      ]
    },
    // Additional beginner challenges...
    ],
    "intermediate": [
      // Intermediate challenges with similar structure but increased complexity
    ],
    "advanced": [
      // Advanced challenges with multiple targets
    ],
    "expert": [
      // Expert challenges with maximum complexity
    ]
}
```

### 15.3 Custom Hook for Challenge Management

```javascript
function useChallengeData() {
  const [challengeData, setChallengeData] = useState({
    beginner: [],
    intermediate: [],
    advanced: [],
    expert: []
  });
  const [loading, setLoading] = useState(true);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  
  // Load challenge data by difficulty level
  useEffect(() => {
    const loadChallenges = async () => {
      try {
        setLoading(true);
        
        // Load challenge data based on user's progress
        const { progress } = useProgressTracking();
        const promises = [];
        
        if (progress.unlockedLevels.includes("beginner")) {
          promises.push(import('../data/challenges/beginner.json'));
        }
        
        if (progress.unlockedLevels.includes("intermediate")) {
          promises.push(import('../data/challenges/intermediate.json'));
        }
        
        if (progress.unlockedLevels.includes("advanced")) {
          promises.push(import('../data/challenges/advanced.json'));
        }
        
        if (progress.unlockedLevels.includes("expert")) {
          promises.push(import('../data/challenges/expert.json'));
        }
        
        const results = await Promise.all(promises);
        
        const data = {};
        progress.unlockedLevels.forEach((level, index) => {
          data[level] = results[index].default;
        });
        
        setChallengeData(data);
      } catch (error) {
        console.error("Failed to load challenge data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadChallenges();
  }, []);
  
  // Load a specific challenge
  const loadChallenge = useCallback((level, number) => {
    if (!challengeData[level]) {
      return null;
    }
    
    const challenge = challengeData[level].find(
      c => c.id === number.toString()
    );
    
    if (challenge) {
      setCurrentChallenge(challenge);
      return challenge;
    }
    
    return null;
  }, [challengeData]);
  
  return {
    challengeData,
    currentChallenge,
    loadChallenge,
    loading
  };
}
```

## 16. Game Board Implementation

### 16.1 Game Board Component

```jsx
const GameBoard = ({ challenge, onSolve }) => {
  const [boardState, setBoardState] = useState(() => initializeBoardState(challenge));
  const [laserPath, setLaserPath] = useState(null);
  const [showingLaser, setShowingLaser] = useState(false);
  
  // Initialize board state from challenge data
  const initializeBoardState = useCallback((challenge) => {
    // Create empty grid
    const grid = Array(challenge.gridSize).fill(null).map(() => 
      Array(challenge.gridSize).fill(null)
    );
    
    // Place fixed tokens
    challenge.fixedTokens.forEach(token => {
      const { position } = token;
      grid[position.row][position.col] = { ...token };
    });
    
    // Place rotation-only tokens
    challenge.rotationTokens.forEach(token => {
      const { position } = token;
      grid[position.row][position.col] = { ...token };
    });
    
    // Initialize palette with add tokens
    const palette = {};
    challenge.addTokens.forEach(token => {
      palette[token.type] = token.count;
    });
    
    return { grid, palette };
  }, []);
  
  // Reset board to initial state
  const resetBoard = useCallback(() => {
    setBoardState(initializeBoardState(challenge));
    setLaserPath(null);
    setShowingLaser(false);
  }, [challenge, initializeBoardState]);
  
  // Fire the laser and calculate its path
  const fireLaser = useCallback(() => {
    const { grid } = boardState;
    
    // Find the laser token
    const laserToken = findLaserToken(grid);
    
    if (!laserToken) {
      return;
    }
    
    // Calculate laser path
    const path = calculateLaserPath(
      grid, 
      laserToken.position, 
      laserToken.orientation
    );
    
    setLaserPath(path);
    setShowingLaser(true);
    
    // Check if the puzzle is solved
    const solved = checkWinCondition(boardState, challenge);
    
    if (solved) {
      onSolve(challenge.id);
    }
  }, [boardState, challenge, onSolve]);
  
  // Event handlers for drag and drop
  const handleDragStart = useCallback((e, token, fromPalette = false) => {
    e.dataTransfer.setData('token', JSON.stringify({
      token,
      fromPalette
    }));
  }, []);
  
  const handleDrop = useCallback((e, cellPosition) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('token'));
    const { token, fromPalette } = data;
    
    // Check if cell is empty
    if (boardState.grid[cellPosition.row][cellPosition.col]) {
      return; // Cell already occupied
    }
    
    // Update board state
    const newState = {
      grid: [...boardState.grid],
      palette: { ...boardState.palette }
    };
    
    // Place token on grid
    newState.grid[cellPosition.row][cellPosition.col] = {
      ...token,
      position: cellPosition
    };
    
    // Remove from palette if it came from there
    if (fromPalette) {
      newState.palette[token.type] -= 1;
    } else {
      // Remove from previous position if moved on grid
      const { position } = token;
      newState.grid[position.row][position.col] = null;
    }
    
    setBoardState(newState);
    setLaserPath(null);
    setShowingLaser(false);
  }, [boardState]);
  
  // Handle token rotation
  const handleRotate = useCallback((position) => {
    const token = boardState.grid[position.row][position.col];
    
    if (!token || !token.rotatable) {
      return; // Cannot rotate this token
    }
    
    // Get next orientation in the sequence
    const tokenDef = tokenTypes[token.type];
    const currentIndex = tokenDef.orientations.indexOf(token.orientation);
    const nextIndex = (currentIndex + 1) % tokenDef.orientations.length;
    const newOrientation = tokenDef.orientations[nextIndex];
    
    // Update the token orientation
    const newState = {
      grid: [...boardState.grid],
      palette: { ...boardState.palette }
    };
    newState.grid[position.row][position.col] = {
      ...token,
      orientation: newOrientation
    };
    
    setBoardState(newState);
    setLaserPath(null);
    setShowingLaser(false);
  }, [boardState]);
  
  return (
    <div className="game-board-container">
      <div className="game-board">
        {/* Grid cells */}
        <div className="grid" style={{ gridTemplateColumns: `repeat(${challenge.gridSize}, 1fr)` }}>
          {boardState.grid.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className="grid-cell"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, { row: rowIndex, col: colIndex })}
                onClick={() => cell && handleRotate({ row: rowIndex, col: colIndex })}
              >
                {cell && (
                  <TokenComponent 
                    token={cell} 
                    draggable={cell.movable}
                    onDragStart={(e) => handleDragStart(e, cell)}
                  />
                )}
              </div>
            ))
          ))}
        </div>
        
        {/* Laser beam layer */}
        {showingLaser && laserPath && (
          <LaserBeam path={laserPath} />
        )}
      </div>
      
      {/* Token palette */}
      <div className="token-palette">
        <h3>Add to Grid</h3>
        <div className="palette-tokens">
          {Object.entries(boardState.palette).map(([type, count]) => (
            count > 0 && (
              <div key={`palette-${type}`} className="palette-token">
                <TokenComponent 
                  token={{ type, orientation: tokenTypes[type].orientations[0], movable: true, rotatable: true }}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, { 
                    type, 
                    orientation: tokenTypes[type].orientations[0],
                    movable: true, 
                    rotatable: true 
                  }, true)}
                />
                <span className="token-count">{count}</span>
              </div>
            )
          ))}
        </div>
      </div>
      
      {/* Game controls */}
      <div className="game-controls">
        <button onClick={fireLaser} className="fire-laser-button">
          Fire Laser
        </button>
        <button onClick={resetBoard} className="reset-button">
          Reset Challenge
        </button>
      </div>
    </div>
  );
};
```

### 16.2 Token Component

```jsx
const TokenComponent = ({ token, draggable = false, onDragStart }) => {
  const { type, orientation } = token;
  
  // Calculate rotation transform
  const getRotationStyle = () => {
    return {
      transform: `rotate(${orientation}deg)`
    };
  };
  
  // Get token color based on type
  const getTokenColor = () => {
    switch(type) {
      case 'laser': return '#FF0000';
      case 'target-mirror': return '#800080';
      case 'mirror': return '#0000FF';
      case 'beam-splitter': return '#00FF00';
      case 'checkpoint': return '#FFA500';
      case 'cell-blocker': return '#444444';
      default: return '#CCCCCC';
    }
  };
  
  // Render token based on type
  const renderTokenContent = () => {
    switch(type) {
      case 'laser':
        return (
          <svg viewBox="0 0 40 40" style={getRotationStyle()}>
            <circle cx="20" cy="20" r="15" fill={getTokenColor()} />
            <polygon points="20,5 30,20 20,35 10,20" fill="#FFFFFF" />
          </svg>
        );
        
      case 'target-mirror':
        return (
          <svg viewBox="0 0 40 40" style={getRotationStyle()}>
            <rect width="40" height="40" rx="5" fill={getTokenColor()} />
            <polygon points="20,35 35,20 5,20" fill="#FF0000" />
            <line x1="5" y1="5" x2="35" y2="5" stroke="#FFFFFF" strokeWidth="3" />
            <line x1="35" y1="5" x2="35" y2="35" stroke="#FFFFFF" strokeWidth="3" />
          </svg>
        );
        
      case 'mirror':
        return (
          <svg viewBox="0 0 40 40" style={getRotationStyle()}>
            <rect width="40" height="40" rx="5" fill={getTokenColor()} />
            <line x1="5" y1="35" x2="35" y2="5" stroke="#FFFFFF" strokeWidth="5" />
          </svg>
        );
        
      case 'beam-splitter':
        return (
          <svg viewBox="0 0 40 40" style={getRotationStyle()}>
            <rect width="40" height="40" rx="5" fill={getTokenColor()} />
            <line x1="20" y1="5" x2="20" y2="35" stroke="#FFFFFF" strokeWidth="3" />
            <line x1="5" y1="20" x2="35" y2="20" stroke="#FFFFFF" strokeWidth="3" />
          </svg>
        );
        
      case 'checkpoint':
        return (
          <svg viewBox="0 0 40 40">
            <rect width="40" height="40" rx="5" fill={getTokenColor()} />
            <circle cx="20" cy="20" r="10" fill="#FFFFFF" />
          </svg>
        );
        
      case 'cell-blocker':
        return (
          <svg viewBox="0 0 40 40">
            <rect width="40" height="40" rx="5" fill={getTokenColor()} />
          </svg>
        );
        
      default:
        return (
          <svg viewBox="0 0 40 40">
            <rect width="40" height="40" rx="5" fill={getTokenColor()} />
            <text x="20" y="25" textAnchor="middle" fill="#FFFFFF" fontSize="24">?</text>
          </svg>
        );
    }
  };
  
  return (
    <div 
      className={`token token-${type} ${draggable ? 'draggable' : ''}`}
      draggable={draggable}
      onDragStart={onDragStart}
    >
      {renderTokenContent()}
      {token.orientation === "?" && (
        <div className="question-mark-overlay">?</div>
      )}
    </div>
  );
};
```

## 17. Implementation Schedule

### 17.1 Phase 1: Core Game Mechanics
- Implement grid and token system
- Create basic token interaction logic
- Develop laser physics engine
- Build challenge data loading system

### 17.2 Phase 2: User Interface
- Implement game board UI
- Create token palette and drag-and-drop
- Develop challenge card visualization
- Build laser beam animation

### 17.3 Phase 3: Game Progress
- Implement challenge selection screen
- Create progress tracking system
- Develop hint and solution system
- Add level unlocking logic

### 17.4 Phase 4: Polish and Optimization
- Optimize performance
- Add animations and visual effects
- Implement sound effects
- Create responsive design for different devices

### 17.5 Phase 5: Testing and Deployment
- Conduct unit and integration testing
- Perform cross-browser testing
- Gather user feedback
- Deploy to production environment

## 18. Future Enhancements

### 18.1 User-Created Challenges
- Challenge editor interface
- Sharing system for custom challenges
- Community rating system

### 18.2 Advanced Game Modes
- Time challenge mode
- Minimal moves mode
- Daily challenge system

### 18.3 Educational Features
- Tutorial on optics principles
- Progressive learning system
- Classroom integration options

## 19. Token Interaction Details

### 19.1 Target/Mirror Token

The target/mirror token is a dual-purpose token with the following behavior:

- Has 4 possible orientations (0°, 90°, 180°, 270°)
- One side functions as a target (activates when hit by laser)
- Three other sides function as mirrors (reflect laser)
- Target side position depends on orientation:
  * 0° = Target on bottom
  * 90° = Target on left
  * 180° = Target on top
  * 270° = Target on right
- Visual feedback: Target lights up when activated

### 19.2 Mirror Token

The mirror token has the following behavior:

- Has 4 possible orientations (45°, 135°, 225°, 315°)
- Reflects laser at a 90° angle
- Orientation determines reflection direction
- Visual feedback: Highlights when reflecting laser

### 19.3 Beam Splitter Token

The beam splitter token has the following behavior:

- Has 4 possible orientations (0°, 90°, 180°, 270°)
- Splits laser into two beams at 90° angles
- Does not reflect the incoming beam
- Visual feedback: Glows when splitting laser

### 19.4 Checkpoint Token

The checkpoint token has the following behavior:

- Has a single orientation
- Must be hit by laser to complete challenge
- Allows laser to pass through
- Visual feedback: Lights up when hit by laser

### 19.5 Cell Blocker Token

The cell blocker token has the following behavior:

- Has a single orientation
- Blocks laser beam completely
- Cannot be moved or rotated
- Visual feedback: None (static object)