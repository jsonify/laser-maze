# Laser Maze

A digital adaptation of the physical board game by ThinkFun. Players arrange mirrors, beam splitters, and other optical elements on a grid to direct a laser beam to activate target(s).

## Features

- Interactive grid-based gameplay
- Multiple optical elements (mirrors, beam splitters, checkpoints)
- Progressive difficulty levels
- Real-time laser path visualization
- Hint system for challenging puzzles

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Jest for testing

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Development

- `npm test` - Run the test suite
- `npm run build` - Build for production
- `npm run lint` - Check for code style issues

## Project Structure

```
src/
├── components/      # React components
├── hooks/          # Custom React hooks
├── contexts/       # React context providers
├── utils/          # Utility functions
└── data/          # Game data and configurations
```

## Game Elements

- Laser Source: Emits a laser beam in a specified direction
- Target/Mirror: Can be hit by laser or reflect it
- Mirror: Reflects laser at 90° angles
- Beam Splitter: Creates two perpendicular laser beams
- Checkpoint: Must be hit by laser to complete level
- Cell Blocker: Blocks laser path

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.