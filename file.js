  const nameInput = document.querySelector(".name-input");
  const startButton = document.querySelector("#start-button");
  const difficultyButtons = document.querySelectorAll(".difficulty-button");
  const rulesButton = document.querySelector(".rules-button");
  const descriptionPopup = document.querySelector("#description");
  const gameContainer = document.querySelector("#game");
  const backToMenuButton = document.querySelector("#back-to-menu");
  const gameGrid = document.querySelector("#game-grid");
  const elapsedTimeElement = document.querySelector("#elapsed-time");
  const playerNameDisplay = document.querySelector("#player-name");
  const railConnections = {
    "empty": [],
    "mountainWestSouth": ["W", "S"],
    "rail": ["N", "S"],
    "rail_rotated": ["E", "W"],
    "curve_railEastSouth": ["E", "S"],
    "curve_railWestSouth": ["W", "S"],
    "curve_railNorthWest": ["N", "W"],
    "curve_railNorthEast": ["N", "E"],
    "bridge_rail": ["N", "S"],
    "mountain_railNorthEast": ["N", "E"],
    "mountain_railNorthWest": ["N", "W"],
    "bridge_rail_rotated": ["W", "E"],
    "mountain_railEastSouth": ["E", "S"],
    "mountain_railWestSouth": ["W", "S"],
    "mountainNorthWest": ["N", "W"],
    "mountainNorthEast": ["N", "E"],
    "mountainEastSouth": ["E", "S"]
};
  
  const oppositeDirection = {
    "N": "S",
    "S": "N",
    "E": "W",
    "W": "E"
  };
  
  const directionOffsets = {
    "N": [-1, 0],  
    "S": [1, 0],   
    "E": [0, 1],   
    "W": [0, -1]   
  };
  

  let playerName = "";
  let difficulty = "";
  let currentLevelMap = []; 
  let leaderboardData = [];



let timer;
let elapsedSeconds = 0;

const startTimer = () => {
  timer = setInterval(() => {
    elapsedSeconds++;
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    elapsedTimeElement.innerText = 
      (minutes < 10 ? "0" : "") + minutes + ":" + 
      (seconds < 10 ? "0" : "") + seconds;
  }, 1000);
};


const stopTimer = () => {
  clearInterval(timer);
};
 




  const checkStartButton = () => {
    if (playerName && difficulty) {
      startButton.disabled = false;
      startButton.style.cursor = "pointer";
    } else {
      startButton.disabled = true;
      startButton.style.cursor = "not-allowed";
    }
  };

  
  nameInput.addEventListener("input", (e) => {
    playerName = e.target.value.trim();
    checkStartButton();
  });

  startButton.addEventListener("click", () => {
    document.querySelector(".menu-container").style.display = "none";
    gameContainer.style.display = "flex";
  });

  
 

 
  difficultyButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      difficultyButtons.forEach((btn) => btn.classList.remove("selected"));
      button.classList.add("selected");
      difficulty = button.textContent.includes("EASY") ? "easy" : "hard";
      checkStartButton();
    });
  });
  

 
  startButton.addEventListener("click", () => {
    document.querySelector(".menu-container").style.display = "none";
    gameContainer.style.display = "flex";
    setupGame(difficulty);
  });

  
  rulesButton.addEventListener("click", () => {
    descriptionPopup.style.display = "flex";
  });

 
  descriptionPopup.addEventListener("click", (event) => {
    if (event.target === descriptionPopup) {
      descriptionPopup.style.display = "none";
    }
  });

  const maps = {
    easy: [
     
      [
        ['empty', 'mountainWestSouth', 'empty', 'empty', 'oasis'],
        ['empty', 'empty', 'empty', 'bridge', 'oasis'],
        ['bridge', 'empty', 'mountainNorthWest', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'oasis', 'empty'],
        ['empty', 'empty', 'mountainNorthEast', 'empty', 'empty']
      ],
      [
        ['oasis', 'empty', 'bridgeRotated', 'empty', 'empty'],
        ['empty', 'mountainNorthWest', 'empty', 'empty', 'mountainNorthWest'],
        ['bridge', 'oasis', 'mountainNorthEast', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'oasis', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty']
      ],
      [
        ['empty', 'empty', 'bridgeRotated', 'empty', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'bridge'],
        ['empty', 'mountainNorthWest', 'bridge', 'empty', 'empty'],
        ['empty', 'oasis', 'empty', 'empty', 'empty'],
        ['empty', 'bridgeRotated', 'empty', 'empty', 'mountainNorthWest']
      ],
      [
        ['empty', 'empty', 'empty', 'bridgeRotated', 'empty'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['bridge', 'empty', 'mountainWestSouth', 'empty', 'mountainWestSouth'],
        ['empty', 'empty', 'empty', 'empty', 'empty'],
        ['empty', 'empty', 'oasis', 'mountainNorthEast', 'empty']
      ],
      [
        ['empty', 'empty', 'empty', 'bridgeRotated', 'empty'],
        ['empty', 'mountainEastSouth', 'empty', 'empty', 'empty'],
        ['bridge', 'empty', 'empty', 'mountainNorthEast', 'empty'],
        ['empty', 'empty', 'bridge', 'oasis', 'empty'],
        ['empty', 'mountainNorthWest', 'empty', 'empty', 'empty']
      ]
      
    ],


    hard:
    [
      [ 
        ["empty", "mountainWestSouth", "oasis",  "oasis", "empty","bridgeRotated", "empty"],
        ["bridge", "empty", "empty", "empty", "empty", "empty", "empty"],
        ["empty", "empty", "bridge", "empty", "empty", "empty", "empty"],
        ["empty", "empty", "empty", "mountainNorthEast", "empty", "empty", "empty"],
        ["mountainNorthEast", "empty", "mountainWestSouth", "empty", "bridgeRotated", "empty", "oasis"],
        ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
        ["empty", "empty", "empty", "bridgeRotated", "empty", "empty", "empty"]
   ],
    [ 
          ["empty", "empty", "oasis", "empty", "empty", "empty", "empty"],
          ["bridge", "empty", "bridgeRotated", "empty", "empty", "mountainNorthWest", "empty"],
          ["empty", "empty", "bridgeRotated", "empty", "empty", "empty", "bridge"],
          ["mountainEastSouth", "empty", "empty", "empty", "empty", "empty", "empty"],
          ["empty", "oasis", "empty", "mountainWestSouth", "empty", "empty", "empty"],
          ["empty", "mountainEastSouth", "empty", "empty", "empty", "empty", "empty"],
          ["empty", "empty", "oasis", "empty", "empty", "empty", "empty"]
  ],
  [
    ["empty", "empty", "bridgeRotated", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "bridge"],
    ["oasis", "empty", "mountainNorthEast", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "oasis", "mountainNorthEast", "empty", "bridgeRotated", "empty", "empty"],
    ["bridge", "empty", "empty", "empty", "empty", "mountainWestSouth", "empty"],
    ["empty", "empty", "oasis", "mountainNorthEast", "empty", "empty", "empty"]
  ],
  [
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "bridge", "empty", "mountainNorthWest", "empty"],
    ["empty", "empty", "mountainNorthEast", "empty", "empty", "empty", "empty"],
    ["empty", "bridgeRotated", "empty", "oasis", "empty", "bridgeRotated", "empty"],
    ["empty", "empty", "mountainNorthWest", "empty", "mountainWestSouth", "empty", "empty"],
    ["bridge", "empty", "empty", "empty", "empty", "mountainNorthEast", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty"]
      
  ],
  [
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "bridge", "empty", "mountainEastSouth", "empty"],
    ["empty", "bridgeRotated", "bridgeRotated", "empty", "mountainWestSouh", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty"],
    ["empty", "empty", "mountainEastSouth", "empty", "oasis", "empty", "empty"],
    ["empty", "mountainNorthWest", "empty", "bridge", "empty", "empty", "empty"],
    ["empty", "empty", "empty", "empty", "empty", "empty", "empty"]
  ]


    ]
  };


 





  const setupGame = (difficulty) => {
    const mapArray = maps[difficulty.toLowerCase()];
    if (!mapArray || mapArray.length === 0) {
        return;
    }

    currentLevelMap = selectRandomLevel(mapArray);
    gameGrid.innerHTML = '';

   
    const gridSize = currentLevelMap.length;
    gameGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    gameGrid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

   
    currentLevelMap.forEach((row, rowIndex) => {
      if (!Array.isArray(row)) {
          return;
      }
      row.forEach((tile, colIndex) => {
          const cell = document.createElement("div");
          cell.classList.add("grid-item", tile);
          cell.dataset.row = rowIndex;
          cell.dataset.col = colIndex;
          cell.addEventListener("click", () => handleTileClick(cell, rowIndex, colIndex));
          gameGrid.appendChild(cell);
        });
      });

};


  const selectRandomLevel = (mapArray) => {
    if (!mapArray || mapArray.length === 0) {
        return [];
    }
    const randomIndex = Math.floor(Math.random() * mapArray.length);
    return mapArray[randomIndex];
};


const handleTileClick = (cell, rowIndex, colIndex) => {
  const nonInteractiveTiles = ["oasis"]; 
  let currentType = currentLevelMap[rowIndex][colIndex];

  if (nonInteractiveTiles.includes(currentType)) {
    return;
  }

   
   if (currentType === "bridge") {
    currentLevelMap[rowIndex][colIndex] = "bridge_rail";
    cell.className = `grid-item bridge_rail`; 
    return;
  } else if (currentType === "bridge_rail") {
    currentLevelMap[rowIndex][colIndex] = "bridge"; 
    cell.className = `grid-item bridge`; 
    return;
  }
  
 
const bridgeWithRailTypes = {
  bridgeRotated: "bridge_rail_rotated",
};

const reverseBridgeWithRailTypes = {
  bridge_rail_rotated: "bridgeRotated", 
};


if (bridgeWithRailTypes[currentType]) {
  currentLevelMap[rowIndex][colIndex] = bridgeWithRailTypes[currentType];
  cell.className = `grid-item ${bridgeWithRailTypes[currentType]}`;
  return; 
} else if (reverseBridgeWithRailTypes[currentType]) {
  currentLevelMap[rowIndex][colIndex] = reverseBridgeWithRailTypes[currentType];
  cell.className = `grid-item ${reverseBridgeWithRailTypes[currentType]}`;
  return; 
}

 
  const mountainWithRailTypes = {
    mountainNorthWest: " mountain_railNorthWest",
    mountainWestSouth: "mountain_railWestSouth",
    mountainEastSouth: "mountain_railEastSouth",
    mountainNorthEast: "mountain_railEastSouth",
    
  };

  const reverseMountainWithRailTypes = {
    mountain_railEastSouth: " mountainEastSouth",
    mountain_railNorthEast: "mountainNorthEast",
    mountain_railNorthWest: " mountainNorthWest",
    mountain_railWestSouth: "mountainWestSouth"
  };

  
   if (currentType === "mountainEastSouth") {
    currentLevelMap[rowIndex][colIndex] = "mountain_railEastSouth";
    cell.className = `grid-item mountain_railEastSouth`;
    return;
  } else if (currentType === "mountain_railEastSouth") {
    currentLevelMap[rowIndex][colIndex] = "mountainEastSouth";
    cell.className = `grid-item mountainEastSouth`;
    return;
  }

  if (currentType === "mountainNorthWest") {
    currentLevelMap[rowIndex][colIndex] = "mountain_railNorthWest";
    cell.className = `grid-item mountain_railNorthWest`;
    return;
  } else if (currentType === "mountain_railNorthWest") {
    currentLevelMap[rowIndex][colIndex] = "mountainNorthWest";
    cell.className = `grid-item mountainNorthWest`;
    return;
  }

  if (currentType === "mountainNorthEast") {
    currentLevelMap[rowIndex][colIndex] = "mountain_railNorthEast";
    cell.className = `grid-item mountain_railNorthEast`;
    return;
  } else if (currentType === "mountain_railNorthEast") {
    currentLevelMap[rowIndex][colIndex] = "mountainNorthEast";
    cell.className = `grid-item mountainNorthEast`;
    return;
  }

  if (mountainWithRailTypes[currentType]) {
    currentLevelMap[rowIndex][colIndex] = mountainWithRailTypes[currentType];
    cell.className = `grid-item ${mountainWithRailTypes[currentType]}`;
    return;
  } else if (reverseMountainWithRailTypes[currentType]) {
    currentLevelMap[rowIndex][colIndex] =
      reverseMountainWithRailTypes[currentType];
    cell.className = `grid-item ${reverseMountainWithRailTypes[currentType]}`;
    return;
  }


  const tileTypes = ["empty", "rail", "rail_rotated", "curve_railEastSouth","curve_railWestSouth","curve_railNorthWest","curve_railNorthEast"]; // Cycle through these tile types
  let nextType = tileTypes[(tileTypes.indexOf(currentType) + 1) % tileTypes.length];

  currentLevelMap[rowIndex][colIndex] = nextType; 
  cell.className = `grid-item ${nextType}`; 

 
   

  validateGameBoard()

};



function validateGameBoard() {
  const gridSize = currentLevelMap.length;

  for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
          const cellType = currentLevelMap[row][col];
          
          
          if (cellType === 'oasis' || cellType === 'empty') {
              continue; 
          }

          const validConnections = railConnections[cellType] || [];

          for (let dir of validConnections) {
              const [dRow, dCol] = directionOffsets[dir];
              const neighborRow = row + dRow;
              const neighborCol = col + dCol;

              if (
                  neighborRow < 0 ||
                  neighborRow >= gridSize ||
                  neighborCol < 0 ||
                  neighborCol >= gridSize
              ) {
                  continue;
              }

              const neighborType = currentLevelMap[neighborRow][neighborCol];
              const expectedOpposite = oppositeDirection[dir];

              if (
                  neighborType !== 'oasis' && (!railConnections[neighborType] || !railConnections[neighborType].includes(expectedOpposite))
              ) {
                  return false;
              }
          }
      }
  }
   


 
  stopTimer();
  updateLeaderboard(playerName, elapsedSeconds);
  return true;
  

  
};


const renderLeaderboard = () => {
  const leaderboardList = document.querySelector("#leaderboard-list");
  leaderboardList.innerHTML = ""; 

  leaderboardData.forEach((entry, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${index + 1}. ${entry.name} - ${formatTime(entry.time)}`;
    leaderboardList.appendChild(listItem);
  });
};

const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};


const updateLeaderboard = (playerName, elapsedTime) => {
  leaderboardData.push({ name: playerName, time: elapsedTime });
  

  leaderboardData.sort((a, b) => a.time - b.time);
  

  leaderboardData = leaderboardData.slice(0, 10);

  renderLeaderboard();
};


nameInput.addEventListener("input", (e) => {
  const name = e.target.value.trim() || "PlayerName"; 
  playerNameDisplay.innerText = name;
});


startButton.addEventListener("click", () => {
  document.querySelector(".menu-container").style.display = "none";
  document.querySelector("#game").style.display = "flex";
  setupGame(difficulty);
  startTimer(); 
});






    

