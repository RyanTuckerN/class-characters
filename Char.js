const levelRef = []
levelRef[0] = 0
for (let i = 1; i < 99; i++) {
  levelRef.push(levelRef[i - 1] + (1000 + 200 * i))
}
levelRef[99] = Infinity

const party = {
  members: [],
  inventory: { Potion: 1, "Phoenix Down": 1 },
  gold: 150,
}

const preAttackCheck = (baddy) => baddy.koed

const checkEnemyStatus = (baddy) => {
  if (baddy.currentHp <= 0) {
    baddy.currentHp = 0
    baddy.koed = true
    party.gold += baddy.gold
    console.log(
      `${baddy.name} has been defeated! You received ${baddy.gold} gold. +${baddy.hpMax} XP.`
    )
    if (baddy.inventory) {
      console.log(`You received ${baddy.inventory}.`)
      if (!party.inventory[baddy.inventory]) {
        party.inventory[baddy.inventory] = 0
      }
      party.inventory[baddy.inventory]++
    }

    party.members.forEach((char) => (char.exp += baddy.hpMax))
    baddy.gold = 0
    baddy = null
  }
}

const spells = {
  fire: function (baddy, owner) {
    const mpReq = 5
    if (owner.currentMp < mpReq) {
      console.log(`Not enough MP! ${owner.currentMp}/${mpReq}`)
      return
    }
    owner.currentMp -= mpReq
    if (baddy.type === "hell-beast") {
      baddy.currentHp += owner.magic
      if (baddy.currentHp > baddy.hpMax) {
        baddy.currentHp = baddy.hpMax
      }
      console.log(
        `${owner.name} healed ${baddy.name} for ${owner.magic}! 🔥 ${baddy.name} absorbs fire attacks!`
      )
    } else {
      baddy.currentHp -= owner.magic
      console.log(`${owner.name} burned ${baddy.name} for ${owner.magic}! 🔥`)
      console.log(`MP remaining: ${owner.currentMp}/${owner.mpMax}`)
    }
  },
  fira: function (baddy, owner) {
    if (owner.level < 15 || owner.magic < 12) {
      console.log("Try again when you are stronger!")
      return
    }
    const mpReq = 15
    if (owner.currentMp < mpReq) {
      console.log(`Not enough MP! ${owner.currentMp}/${mpReq}`)
      return
    }
    owner.currentMp -= mpReq
    if (baddy.type === "hell-beast") {
      baddy.currentHp += owner.magic
      if (baddy.currentHp > baddy.hpMax) {
        baddy.currentHp = baddy.hpMax
      }
      console.log(
        `${owner.name} healed ${baddy.name} for ${owner.magic}! 🔥🔥 ${baddy.name} absorbs fire attacks!`
      )
    } else {
      baddy.currentHp -= owner.magic
      console.log(`You burned ${baddy.name} for ${owner.magic * 1.5}! 🔥🔥`)
      console.log(`MP remaining: ${owner.currentMp}/${owner.mpMax}`)
    }
  },
  firaga: function (baddy, owner) {
    const mpReq = 40
    if (owner.level < 25 || owner.magic < 15) {
      console.log("Try again when you are stronger!")
      return
    }
    if (owner.currentMp < mpReq) {
      console.log(`Not enough MP! ${owner.currentMp}/${mpReq}`)
      return
    }
    owner.currentMp -= mpReq
    if (baddy.type === "hell-beast") {
      baddy.currentHp += owner.magic
      if (baddy.currentHp > baddy.hpMax) {
        baddy.currentHp = baddy.hpMax
      }
      console.log(
        `${owner.name} healed ${baddy.name} for ${owner.magic}! 🔥🔥🔥 ${baddy.name} absorbs fire attacks!`
      )
    } else {
      baddy.currentHp -= owner.magic
      console.log(
        `${owner.name} burned ${baddy.name} for ${owner.magic * 2.5}! 🔥🔥🔥`
      )
      console.log(`MP remaining: ${owner.currentMp}/${owner.mpMax}`)
    }
  },
}
const specials = {
  steal: function steal(enemy) {
    if (enemy.koed) return
    if (!enemy.inventory) {
      console.log(`${enemy.name} has nothing to steal!`)
      return
    }
    if (Math.round(Math.random() * 100) < (this.level < 15 ? 25 : this.level)) {
      console.log(`You stole ${enemy.inventory}!`)
      if (!party.inventory[enemy.inventory]) {
        party.inventory[enemy.inventory] = 0
      }
      party.inventory[enemy.inventory]++
      enemy.inventory = null
    } else console.log(`You couldn't steal...`)
  },
  magic: function magic(baddy, spell, owner) {
    if (preAttackCheck(baddy)) {
      console.log("The enemy is already defeated!")
      return
    }

    if (!this.currentMp < spells[spell].mpReq) {
      console.log(`Not enough MP!${this.currentMp}/5`)
      return
    }
    spells[spell](baddy, this)
    checkEnemyStatus(baddy)
  },

  kungFu: function kungFu(baddy, move) {
    if (preAttackCheck(baddy)) {
      console.log("The enemy is already defeated!")
      return
    }
    console.log(
      `Flying at the speed of light, ${this.name} hit ${
        baddy.name
      } with a ${move} for ${Math.ceil(this.physical + this.level * 7.5)}!`
    )
    baddy.currentHp -= Math.ceil(this.physical + this.level * 7.5)
    checkEnemyStatus(baddy)
  },

  heal: function heal() {
    if (this.currentMp < 7) {
      console.log(`Not enough MP! ${this.currentMp}/7.`)
      return
    }
    this.currentMp -= 7
    party.members.forEach((member) => {
      member.currentHp += Math.ceil(this.magic + this.level * 2.5)
      member.currentHp =
        member.currentHp > member.hpMax ? member.hpMax : member.currentHp
      console.log(
        `${member.name} was healed for ${Math.ceil(
          this.magic + this.level * 2.5
        )}!`
      )
    })
  },
}

class Enemy {
  constructor(
    name,
    type,
    physical,
    magic,
    defense,
    speed,
    description,
    level,
    basicAtk,
    inventory,
    special = null
  ) {
    this.name = name
    this.type = type
    this.physical = physical + physical * 0.25 * level
    this.magic = magic + magic * 0.25 * level
    this.defense = defense + defense * 0.25 * level
    this.speed = speed + speed * 0.25 * level
    this.description = description
    this.special = special
    this.level = level
    this.basicAtk = basicAtk
    this.inventory = inventory
    this.gold = level * 15
    this.koed = false
    this.hpMax = Math.ceil(15 * defense * (level > 5 ? level / 2.5 : 4))
    this.mpMax = 2 * magic
    this.currentHp = this.hpMax
    this.currentMp = this.mpMax
  }

  attack(character) {
    if (this.koed) return
    if (Math.random() * this.speed > Math.random() * character.speed) {
      const hit = Math.ceil(Math.random() * this.physical)
      console.log(
        `${this.name}'s ${this.basicAtk} hit ${character.name} for ${hit} HP.`
      )
      character.currentHp -= hit
    } else {
      console.log(
        `${this.name} tried to ${this.basicAtk} ${character.name}, but missed!`
      )
    }
    if (character.currentHp <= 0) {
      character.currentHp = 0
      character.koed = true
      console.log(`${character.name} is KO'ed!`)
    }
  }

  getStats() {
    console.log(
      `HP: ${this.currentHp}/${this.hpMax}, 
      MP: ${this.currentMp}/${this.mpMax}, 
      Level: ${this.level}, Type: ${this.type}, 
      Description: ${this.description}`
    )
  }
}

class Character {
  constructor(
    name,
    type,
    physical,
    magic,
    defense,
    speed,
    basicAtk,
    description,
    special,
    level
  ) {
    this.name = name
    this.type = type
    this.physical = physical
    this.magic = magic
    this.defense = defense
    this.speed = speed
    this.basicAtk = basicAtk
    this.description = description
    this.special = specials[special]
    this.level = level
    this.exp = level * 200 + 1000
    this.koed = false
    this.hpMax = 15 * defense
    this.mpMax = 2 * magic
    this.currentHp = this.hpMax
    this.currentMp = this.mpMax
  }

  gainLevel() {
    switch (this.type) {
      case "rogue":
        if (this.speed === 50) {
          this.physical += 0.75
          this.magic += 0.25
          this.defense += 0.5
        } else {
          this.physical += 0.25
          this.magic += 0.125
          this.defense += 0.25
          this.speed += 0.5
        }

        break

      case "mage":
        if (this.magic === 50) {
          this.physical += 0.5
          this.speed += 0.25
          this.defense += 0.5
        } else {
          this.physical += 0.125
          this.magic += 0.5
          this.defense += 0.25
          this.speed += 0.25
        }
        break

      case "monk":
        if (this.physical === 50) {
          this.speed += 0.75
          this.magic += 0.25
          this.defense += 0.5
        } else {
          this.physical += 0.5
          this.magic += 0.125
          this.defense += 0.25
          this.speed += 0.25
        }
        break

      case "healer":
        if (this.defense === 50) {
          this.physical += 0.25
          this.magic += 0.75
          this.speed += 0.5
        } else {
          this.physical += 0.125
          this.magic += 0.25
          this.defense += 0.5
          this.speed += 0.25
        }
        break
    }
    this.hpMax += Math.ceil(
      (this.exp * (this.physical ? this.physical : 1)) / 200000
    )
    if (this.hpMax > 9999) this.hpMax = 9999

    this.mpMax += Math.ceil(
      (this.exp * (this.magic ? this.magic : 1)) / 2000000
    )
    if (this.mpMax > 999) this.mpMax = 999

    this.currentHp = this.hpMax
    this.currentMp = this.mpMax

    console.log(`${this.name} gained a level!`)
  }

  checkLevel() {
    let currentLev = this.level
    const lev = levelRef.filter((num) => num < this.exp).length
    this.level = lev > 0 ? lev : 1
    if (this.level > currentLev) {
      for (let i = 0; i < this.level - currentLev; i++) {
        this.gainLevel()
      }
    }
  }

  gainExp(xp) {
    this.exp += xp
    this.checkLevel()
  }

  attack(baddy) {
    if (preAttackCheck(baddy)) {
      console.log("The enemy is already defeated!")
      return
    }
    if (Math.random() * this.speed > Math.random() * baddy.speed) {
      const hit = Math.ceil(Math.random() * this.physical)
      console.log(
        `${this.name}'s ${this.basicAtk} hit ${baddy.name} for ${hit} HP.`
      )
      baddy.currentHp -= hit
    } else {
      console.log(
        `${this.name} tried to ${this.basicAtk} ${baddy.name}, but missed!`
      )
    }
    checkEnemyStatus(baddy)
  }
}

const RyanBio =
  'Ryan is an adventurer and thief who insists he is actually a "treasure hunter", and is a member of the Returners, the resistance group opposing the Gestahlian Empire. Ryan acts as a spy, saboteur, and scout for the Returners.'
const KaylaBio =
  "Kayla was born in the Esper World to an esper father, Maduin, and a human mother, Madeline. When the Gestahlian Empire raided the land and abducted Maduin, he and Madeline were accidentally cast out of the Esper World with Kayla. Due to her innate magical ability, Kayla was given the title of Magitek Elite."
const MarcusBio =
  "Marcus is a Monk. His special ability is Kung-Fu, which lets him execute powerful martial arts techniques. He has high physical stats and wields claws as his weapon type, and his armor includes universal shields and lightweight armor."
const JakeBio =
  "Jake is a Rune Knight with balanced stats and a wide range of equipment, making him useful in both physical damage roles and magical damage roles. His ability is Heal, which allows him to heal all party members at once."

const Ryan = new Character(
  "Ryan",
  "rogue",
  8,
  2,
  10,
  10,
  "stab",
  RyanBio,
  "steal",
  1
)
const Kayla = new Character(
  "Kayla",
  "mage",
  7,
  13,
  11,
  5,
  "hex",
  KaylaBio,
  "magic",
  1
)
const Marcus = new Character(
  "Marcus",
  "monk",
  14,
  0,
  9,
  7,
  "punch",
  MarcusBio,
  "kungFu",
  1
)
const Jake = new Character(
  "Jake",
  "healer",
  2,
  13,
  13,
  2,
  "slice",
  JakeBio,
  "heal",
  1
)

const Wolf = new Enemy(
  "Wolf",
  "beast",
  7,
  0,
  6,
  7,
  "A fierce wild creature with a taste for blood.",
  50,
  "bite",
  "Potion"
)

const behemothItems = [
  "Mirror Ring",
  "Potion",
  "Potion",
  "Potion",
  "Potion",
  "Potion",
  "Phoenix Down",
  "Phoenix Down",
  "Phoenix Down",
  "Mirror Ring",
  "Potion",
  "Potion",
  "Potion",
  "Potion",
  "Potion",
  "Phoenix Down",
  "Phoenix Down",
  "Phoenix Down",
  "Mirror Ring",
  "Potion",
  "Potion",
  "Potion",
  "Potion",
  "Potion",
  "Phoenix Down",
  "Phoenix Down",
  "Phoenix Down",
  "Galaxy Sabre",
]
const Behemoth = new Enemy(
  "Behemoth",
  "mythical-beast",
  7,
  7,
  6,
  2,
  "A mythical being from beyond this plane of existence, the behemoth exists only to maim.",
  55,
  "aura-blast",
  behemothItems[Math.floor(Math.random() * behemothItems.length)]
)

const demonItems = [
  "Firesuit",
  "Potion",
  "Potion",
  "Potion",
  "Potion",
  "Potion",
  "Phoenix Down",
  "Phoenix Down",
  "Phoenix Down",
  "Firesuit",
  "Potion",
  "Potion",
  "Potion",
  "Potion",
  "Potion",
  "Phoenix Down",
  "Phoenix Down",
  "Phoenix Down",
  "Firesuit",
  "Potion",
  "Potion",
  "Potion",
  "Potion",
  "Potion",
  "Phoenix Down",
  "Phoenix Down",
  "Phoenix Down",
  "Flame Axe",
]
let Demon = new Enemy(
  "Blood Demon",
  "hell-beast",
  9,
  6,
  6,
  6,
  "A demon from the depths of Hell. It absorbs fire elemental damage",
  666,
  "flame-thrower",
  demonItems[Math.floor(Math.random() * demonItems.length)]
)

party.members.push(Ryan)
party.members.push(Marcus)
party.members.push(Jake)
party.members.push(Kayla)

party.members.forEach(member=>{
  member.gainExp(500000)
})