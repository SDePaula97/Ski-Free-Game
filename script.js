

import kaboom from 'kaboom'
//const kaboom = require('kaboom')
kaboom({
  background: [255, 255, 255],
  height: 1000,
  width:1000, 
})


const playerScore = document.getElementById("player-score");
const computerScore = document.getElementById("computer-score");;
const resetBtn = document.getElementById("reset-button");
const winnerAlert = document.getElementById("winner-alert");

loadSprite("jonSnow3", "jonSnow3.png")


const skierImage = [
  "jonSnow3",
]


const obstacles = [
  "spike",
  "ramp",
  "snowTree",
  "snowTile",
  "bush",

]

const monsters = [
  "badguy1",
  "ghosty",
  "iceMonster",
  
]

// load all skiers visuals
// for (const skier of skierImage) {
//   loadSprite(skier, `https://kaboomjs.com/sprites/apple.png
//   `)
// }

// load all the obstacles
for (const obstacle of obstacles) {
  loadSprite(obstacle, `${obstacle}.png`)
}

// load all monster visuals
 for (const monster of monsters) {
  loadSprite(monster, `${monster}.png`)
}

//start scene
scene("startGame", () => {
  let OBSTACLE_SPEED_X = 0
  let OBSTACLE_SPEED_Y = -90
  let PAUSED = true
  let AIRBORNE = false

  const player = add([
    sprite("jonSnow3"),
    area(),
    pos(width() /2, height() /2),
    origin("center"),
    "player",
    {
      state: "going-right"
    }
  ])
  
  // handle presses left
  onKeyPress("left", () => {
    switch(player.state) {
      case "about-to-be-eaten":
        break
      case "flat":
        break
      case "going-forward":
        player.state = "going-kinda-left"
        player.use(sprite("jonSnow3"))
        OBSTACLE_SPEED_X = 90
        OBSTACLE_SPEED_Y = -90
        PAUSED = false
        break
      default:
        player.state = "going-left"
        player.use(sprite("jonSnow3"))
        OBSTACLE_SPEED_X = 0
        OBSTACLE_SPEED_Y = 0
        PAUSED = true
        break
    }
  })

  // handle presses right
  onKeyPress("right", () => {
    switch(player.state) {
      case "about-to-be-eaten":
        break
      case "flat":
        break
      case "going-forward":
        player.state = "going-kinda-right"
        player.use(sprite("jonSnow3"))
        OBSTACLE_SPEED_X = -90
        OBSTACLE_SPEED_Y = -90
        PAUSED = false
        break
      default:
        player.state = "going-right"
        player.use(sprite("jonSnow3"))
        OBSTACLE_SPEED_X = 0
        OBSTACLE_SPEED_Y = 0
        PAUSED = true
        break
    }
  })

  // handle presses down
  onKeyPress("down", () => {
    if (player.state == "about-to-be-eaten" || player.state == "flat") return
    player.state = "going-forward"
    player.use(sprite("jonSnow3"))
    OBSTACLE_SPEED_X = 0
    OBSTACLE_SPEED_Y = -90
    PAUSED = false
  })

 // spawn new obstacles
  function spawnObstacle() {
    const name = choose(obstacles)

    add([
      sprite(name),
      area(),
      pos(rand(width()), height()),
      origin("bot"),
      name == "spike" ? "spike" : "danger",
      "obstacle"
    ])
  }

  // spawn obstacles continuously
  loop(0.5, () => {
    if (PAUSED !== true) {
          spawnObstacle()
    }
  })


 // move all obstacles
  onUpdate("obstacle", (o) => {
    if (PAUSED !== true) {
          o.move(OBSTACLE_SPEED_X, OBSTACLE_SPEED_Y)
      if (o.pos.y < 0) {
        destroy(o)
      }
    }
  })

  // handle collisions
  player.onCollide("danger", () => {
    if (!AIRBORNE) {
          gameOver()
    }
  })

  // handle collisions of the ramp to make sure the player only gets to use it if going forward
  player.onCollide("tree2", () => {
    if (player.state == "going-forward") {
      player.use(sprite("jonSnow3"))
      OBSTACLE_SPEED_Y = -400
      AIRBORNE = true
      wait(1, () => {
        OBSTACLE_SPEED_Y = -90
        AIRBORNE = false
        player.use(sprite("jonSnow3"))
      })
    } else {
      if (!AIRBORNE) {
        gameOver()
      }
    }
  })
  
 let winner;
let chooseWinner = () => {
  if (
    Number(playerScore.textContent) > Number(computerScore.textContent)
  ) {
    winner = "Player wins!";
  }
  if (
    Number(playerScore.textContent) < Number(computerScore.textContent)
  ) {
    winner = "Computer wins!";
  } else {
    winner = "It's a Tie. No one wins! ";
  }
};

// game over
  function gameOver() {
    shake(20)
    player.use(sprite("jonSnow3"))
    player.state = "flat"
    OBSTACLE_SPEED_X = 0
    OBSTACLE_SPEED_Y = 0
    wait(1, () => {
      go("startGame")
    })
  }

 // randomly add Monster
  wait(rand(200), () => {
    PAUSED = true
    player.state = "about-to-be-eaten"
    OBSTACLE_SPEED_X = 0
    OBSTACLE_SPEED_Y = 0

    const monster = add([
      sprite("badguy1"),
      area(),
      pos(rand(width()), height()),
      origin("bot"),
      "monster"
    ])

    wait(0.5, () => {
      monster.use(sprite("badguy1"))
      monster.pos.x = monster.pos.x - (player.pos.x / 3)
      monster.pos.y = monster.pos.y - (player.pos.y / 3)
    })

    wait(1, () => {
      monster.use(sprite("badguy1"))
      monster.pos.x = monster.pos.x - (player.pos.x / 2)
      monster.pos.y = monster.pos.y - (player.pos.y / 2)
    })
  
    wait(1.5, () => {
        monster.use(sprite("badguy1"))
        monster.pos.x = player.pos.x
        monster.pos.y = player.pos.y
        destroy(player)
      })
  
    wait(2, () => {
      monster.use(sprite("badguy1"))
    })
  
     wait(2.5, () => {
      monster.use(sprite("badguy1"))
    })
  
    wait(3, () => {
      monster.use(sprite("badguy1"))
    })
  
     wait(3.5, () => {
      monster.use(sprite("badguy1"))
    })
  
    wait(5, () => {
        go("startGame")
    }) 
  })
})

resetBtn.addEventListener("click", resetBtn);
go("startGame")
