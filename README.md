# 🎮 RevoFun Gaming Company - Interactive Gaming Platform

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/pUNCiVii)

## 📋 Project Overview

**RevoFun** is a modern, interactive gaming platform that showcases a fictional gaming company's web presence. Built with vanilla JavaScript, HTML5, and CSS3, this project demonstrates advanced web development skills through three engaging browser-based games.

The platform features a sleek, dark-themed design inspired by modern gaming aesthetics, complete with glassmorphism effects, smooth animations, and responsive design that works seamlessly across all devices.

## ✨ Features Implemented

### 🎯 Core Features
- **Interactive Gaming Platform**: Three fully functional JavaScript games
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Dark Theme UI**: Modern glassmorphism design with custom color palette
- **Data Persistence**: localStorage integration for scores and user profiles
- **Smooth Animations**: CSS transitions and keyframe animations
- **Leaderboard System**: Track high scores across all games
- **User Profiles**: Optional name registration with statistics tracking

### 🎲 Game Collection

#### 1. 🔢 Number Guessing Game
- **Objective**: Guess the secret number between 1-100
- **Features**:
  - 5 attempts maximum
  - Enhanced mathematical hints (prime, even/odd, divisibility, perfect squares, etc.)
  - Real-time input validation
  - Score calculation based on attempts and time
  - Persistent high score tracking

#### 2. ✂️ Rock, Paper, Scissors
- **Objective**: Beat the computer in best-of-3 rounds
- **Features**:
  - Visual choice selection with emoji icons
  - Round-by-round scoring
  - Game completion detection
  - "New Game" button after game ends
  - Win/loss statistics tracking

#### 3. 🧠 Memory Card Game
- **Objective**: Match all card pairs with minimal moves
- **Features**:
  - 8-card grid (4 pairs) with flip animations
  - Move counter and timer
  - Score calculation based on speed and efficiency
  - Card matching logic with visual feedback
  - Game completion celebration

### 🎨 Design Features
- **Glassmorphism Effects**: Frosted glass backgrounds with backdrop blur
- **Custom Color Palette**: Dark theme with mint green accents (#2b2c28, #339989, #7de2d1)
- **Smooth Scrolling**: Enhanced navigation experience
- **Floating Animations**: Subtle hover effects and transitions
- **Responsive Grid**: Adaptive layout for all screen sizes

## 🛠️ Technologies Used

### Frontend Technologies
- **HTML5**: Semantic markup and modern structure
- **CSS3**: 
  - Flexbox and CSS Grid for layouts
  - CSS Variables for theming
  - Keyframe animations and transitions
  - Media queries for responsiveness
  - Backdrop-filter for glassmorphism effects
- **JavaScript (ES6+)**:
  - DOM manipulation and event handling
  - localStorage for data persistence
  - Modular code architecture
  - Arrow functions and template literals
  - Array methods and object handling

### Development Tools
- **Google Fonts**: Inter font family for typography
- **VS Code**: Development environment
- **Git**: Version control
- **Live Server**: Local development server

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📁 Project Structure

```
milestone-2-MuhammadRizal-ctrl/
├── 📄 index.html                    # Main landing page
├── 🎮 rock-paper-scissors.html     # Rock Paper Scissors game page
├── 🔢 number-guessing.html         # Number Guessing game page
├── 🧠 memory-game.html             # Memory Card game page
├── 📁 css/
│   ├── 🎨 style.css                # Main stylesheet with dark theme
│   └── 🎮 games.css                # Game-specific styles and animations
├── 📁 js/
│   ├── 🔧 main.js                  # Shared utilities and navigation
│   ├── ✂️ rock-paper-scissors.js  # RPS game logic and scoring
│   ├── 🔢 number-guessing.js      # Number guessing with enhanced hints
│   └── 🧠 memory-game.js          # Memory card game implementation
└── 📖 README.md                    # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional installations required

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd milestone-2-MuhammadRizal-ctrl
   ```

2. **Open the project:**
   ```bash
   # Option 1: Double-click index.html
   # Option 2: Use VS Code Live Server extension
   # Option 3: Use Python's built-in server:
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

3. **Start playing:**
   - Navigate to the main page
   - Choose any game from the grid
   - Enter your name (optional) to track scores
   - Enjoy the games!

## 🎮 How to Play

### 🔢 Number Guessing Game
1. Enter your name (optional)
2. Guess a number between 1-100
3. Receive helpful mathematical hints about the number
4. Try to guess within 5 attempts for maximum score!

### ✂️ Rock, Paper, Scissors
1. Click your choice (Rock 🪨, Paper 📄, or Scissors ✂️)
2. Computer makes its choice automatically
3. See who wins each round
4. First to 3 wins takes the game!

### 🧠 Memory Card Game
1. Click two cards to flip them
2. If they match, they stay open
3. If not, they flip back after a moment
4. Match all pairs to win!

## 🏆 Scoring System

- **Number Guessing**: Base score + time bonus + attempt bonus
- **Rock, Paper, Scissors**: Win/loss tracking with final game scores
- **Memory Game**: Speed and efficiency-based scoring

## 💾 Data Persistence

The platform uses `localStorage` to maintain:
- **High Scores**: Best performance for each game
- **User Profiles**: Player names and statistics
- **Game Progress**: Current state and preferences
- **Leaderboards**: Top 10 scores per game

## 🔧 Technical Implementation

### JavaScript Features Demonstrated
- **DOM Manipulation**: querySelector, getElementById, event listeners
- **Data Structures**: Arrays, objects, and localStorage
- **Control Flow**: Conditionals, loops, switch statements
- **Functions**: Modular code organization and reusability
- **Template Literals**: Dynamic content generation
- **Mathematical Operations**: Game mechanics and scoring
- **Error Handling**: Input validation and edge case management

### CSS Features
- **Modern Layout**: Flexbox and CSS Grid
- **CSS Variables**: Consistent theming system
- **Animations**: Smooth transitions and hover effects
- **Responsive Design**: Mobile-first approach
- **Glassmorphism**: Modern UI design trends

## 🎨 Design Philosophy

The project follows modern web design principles:
- **Dark Theme**: Reduces eye strain and provides modern aesthetic
- **Glassmorphism**: Semi-transparent elements with backdrop blur
- **Consistent Branding**: RevoFun identity throughout all pages
- **Accessibility**: Clear instructions and intuitive navigation
- **Performance**: Optimized animations and efficient code

## 🚀 Future Enhancements

- Additional games (Clicker Game, Avoid Falling Objects)
- Multiplayer functionality
- Advanced animations and effects
- Sound effects and music
- Mobile app version
- User authentication system
- Social features and sharing

## 📸 Screenshots

*Note: Screenshots would be added here showing:*
- Main landing page with dark theme
- Game selection grid
- Individual game interfaces
- Mobile responsive design
- Leaderboard displays

## 🔍 Code Quality

### Organization
- **Modular Structure**: Each game in separate JavaScript file
- **Clear Comments**: Extensive documentation for learning
- **Consistent Naming**: Meaningful variable and function names
- **Error Handling**: Input validation and edge case management

### Performance
- **Optimized Animations**: Smooth 60fps transitions
- **Efficient DOM Manipulation**: Minimal reflows and repaints
- **Lazy Loading**: Resources loaded as needed
- **Responsive Images**: Optimized for different screen sizes

## 📝 License

This project is created for educational purposes as part of a web development milestone assignment.

## 👨‍💻 Developer

**Muhammad Rizal** - Web Developer
- JavaScript Game Development
- DOM Manipulation & Event Handling
- Modern CSS & Responsive Design
- UI/UX Design Implementation

---


## 🔗 Live Demo

*[Add live demo link here when deployed]*

## 📞 Contact

For questions or feedback about this project, please contact the developer.

---

**Last Updated**: September 2025