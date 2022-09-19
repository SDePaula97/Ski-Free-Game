
// const searchButton = document.querySelector('#search-button')
// const searchButtonContent = document.querySelector('#search-button div')

// searchButton.addEventListener('click',toggleButton )

// function toggleButton() {
//   searchButtonContent.classList.toggle('loading')

// }

import kaboom from 'kaboom'
//const kaboom = require('kaboom')
kaboom()

const skiers = [
  "skier-forward",
  "skier-kinda-right",
  "skier-kinda-left",
  "skier-right",
  "skier-left",
  "skier-jumping",
  "skier-ouch"
]

const obstacles = [
  "tree",
  "ramp",
  "dog",
  "large-tree",
  "burnt-tree"
]

const monsters = [
  "monster-move-1",
  "monster-move-2",
  "monster-move-3",
  "monster-move-4",
  "monster-move-5",
  "monster-move-6",
  "monster-move-7",
  "monster-move-8",
]

// load all skiers visuals
for (const skier of skiers) {
  loadSprite(skier, `/sprites/${skier}.png`)
}

// load all the obstacles
for (const obstacle of obstacles) {
  loadSprite(obstacle, `/sprites/${obstacle}.png`)
}

// load all monster visuals
for (const monster of monsters) {
  loadSprite(monster, `/sprites/${monster}.png`)
}

//start scene
scene("ski", () => {
  let OBSTACLE_SPEED_X = 0
  let OBSTACLE_SPEED_Y = -90
  let PAUSED = true
  let AIRBORNE = false

  const player = add([
    sprite("skier-right"),
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
        player.use(sprite("skier-kinda-left"))
        OBSTACLE_SPEED_X = 90
        OBSTACLE_SPEED_Y = -90
        PAUSED = false
        break
      default:
        player.state = "going-left"
        player.use(sprite("skier-left"))
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
        player.use(sprite("skier-kinda-right"))
        OBSTACLE_SPEED_X = -90
        OBSTACLE_SPEED_Y = -90
        PAUSED = false
        break
      default:
        player.state = "going-right"
        player.use(sprite("skier-right"))
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
    player.use(sprite("skier-forward"))
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
      name == "ramp" ? "ramp" : "danger",
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
  player.onCollide("ramp", () => {
    if (player.state == "going-forward") {
      player.use(sprite("skier-jumping"))
      OBSTACLE_SPEED_Y = -400
      AIRBORNE = true
      wait(1, () => {
        OBSTACLE_SPEED_Y = -90
        AIRBORNE = false
        player.use(sprite("skier-forward"))
      })
    } else {
      if (!AIRBORNE) {
        gameOver()
      }
    }
  })

  // game over
  function gameOver() {
    shake(20)
    player.use(sprite("skier-ouch"))
    player.state = "flat"
    OBSTACLE_SPEED_X = 0
    OBSTACLE_SPEED_Y = 0
    wait(1, () => {
      go("ski")
    })
  }

 // randomly add Monster
  wait(rand(200), () => {
    PAUSED = true
    player.state = "about-to-be-eaten"
    OBSTACLE_SPEED_X = 0
    OBSTACLE_SPEED_Y = 0

    const monster = add([
      sprite("monster-move-1"),
      area(),
      pos(rand(width()), height()),
      origin("bot"),
      "monster"
    ])

    wait(0.5, () => {
      monster.use(sprite("monster-move-2"))
      monster.pos.x = monster.pos.x - (player.pos.x / 3)
      monster.pos.y = monster.pos.y - (player.pos.y / 3)
    })

    wait(1, () => {
      monster.use(sprite("monster-move-3"))
      monster.pos.x = monster.pos.x - (player.pos.x / 2)
      monster.pos.y = monster.pos.y - (player.pos.y / 2)
    })
  
    wait(1.5, () => {
        monster.use(sprite("monster-move-4"))
        monster.pos.x = player.pos.x
        monster.pos.y = player.pos.y
        destroy(player)
      })
  
    wait(2, () => {
      monster.use(sprite("monster-move-5"))
    })
  
     wait(2.5, () => {
      monster.use(sprite("monster-move-6"))
    })
  
    wait(3, () => {
      monster.use(sprite("monster-move-7"))
    })
  
     wait(3.5, () => {
      monster.use(sprite("monster-move-8"))
    })
  
    wait(5, () => {
        go("ski")
    }) 
  })


  
})
const playGameBtn = document.querySelector('#start-button');
playGameBtn.addEventListener('click', playGame)
console.log('test');


go("ski")