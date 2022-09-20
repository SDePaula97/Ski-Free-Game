
// const searchButton = document.querySelector('#search-button')
// const searchButtonContent = document.querySelector('#search-button div')

// searchButton.addEventListener('click',toggleButton )

// function toggleButton() {
//   searchButtonContent.classList.toggle('loading')

// }

import kaboom from 'kaboom'
//const kaboom = require('kaboom')
kaboom({
  background: [255, 255, 255]
})

const Btn = document.getElementById('Btn')

//console.log('test');

const skierImage = [
  "jonSnow",
]


const obstacles = [
  "tree",
  "pond",
  "mountain",
]

const monsters = [
  "badguy1",
  "badguy2",
]

// load all skiers visuals
for (const skier of skierImage) {
  loadSprite(skier, `https://kaboomjs.com/sprites/apple.png
  `)
}

// load all the obstacles
for (const obstacle of obstacles) {
  loadSprite(obstacle, `https://kaboomjs.com/sprites/apple.png
  `)
}

// load all monster visuals
for (const monster of monsters) {
  loadSprite(monster, `https://kaboomjs.com/sprites/apple.png
  `)
}

//start scene
scene("ski", () => {
  let OBSTACLE_SPEED_X = 0
  let OBSTACLE_SPEED_Y = -90
  let PAUSED = true
  let AIRBORNE = false

  const player = add([
    ("https://kaboomjs.com/sprites/apple.png"),
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
        player.use(sprite("jonSnow-kinda-left"))
        OBSTACLE_SPEED_X = 90
        OBSTACLE_SPEED_Y = -90
        PAUSED = false
        break
      default:
        player.state = "going-left"
        player.use(sprite("jonSnow-left"))
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
        player.use(sprite("jonSnow-kinda-right"))
        OBSTACLE_SPEED_X = -90
        OBSTACLE_SPEED_Y = -90
        PAUSED = false
        break
      default:
        player.state = "going-right"
        player.use(sprite("jonSnow-right"))
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
    player.use(sprite("jonSnow-forward"))
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
      name == "pond" ? "pond" : "danger",
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
  player.onCollide("tree", () => {
    if (player.state == "going-forward") {
      player.use(sprite("jonSnow-jumping"))
      OBSTACLE_SPEED_Y = -400
      AIRBORNE = true
      wait(1, () => {
        OBSTACLE_SPEED_Y = -90
        AIRBORNE = false
        player.use(sprite("jonSnow-forward"))
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
    player.use(sprite("jonSnow-ouch"))
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
        monster.use(sprite("badguy2"))
        monster.pos.x = player.pos.x
        monster.pos.y = player.pos.y
        destroy(player)
      })
  
    wait(2, () => {
      monster.use(sprite("badguy2"))
    })
  
     wait(2.5, () => {
      monster.use(sprite("badguy2"))
    })
  
    wait(3, () => {
      monster.use(sprite("badguy2"))
    })
  
     wait(3.5, () => {
      monster.use(sprite("badguy2"))
    })
  
    wait(5, () => {
        go("ski")
    }) 
  })


  
})

//Btn.addEventListener('click', playGame)
go("ski")