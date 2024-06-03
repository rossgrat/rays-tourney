import {
    startRounds
} from './start-rounds'

export interface AllBlocks {
    blocks: Block[]
}

export interface Block {
    numPlayers: number
    startRound: Round
}

export interface Tourney {
    rounds: Round[]
}

export interface Round {
    tables: Table[]
}

export interface Table {
    teams: Team[]
}

export interface Team {
    players: number[]
}

var Blocks: AllBlocks
export function ParseStartBlocks () {
    Blocks = JSON.parse(startRounds)
}

export function GenerateTouurnament(numPlayers: number): Tourney {
    let startBlock: Block = {
        numPlayers: -1,
        startRound: {
            tables: []
        }
    }
    let tourney: Tourney = {
        rounds: []
    }

    for(let block of Blocks.blocks) {
        if (block.numPlayers === numPlayers) {
            startBlock = block
            break
        }
    }
    if (startBlock.numPlayers === -1) {
        console.log("Failed to find starting block for "+numPlayers+" players")
        return tourney
    }
    tourney.rounds.push(startBlock.startRound)

    for (let roundNum = 1; roundNum < numPlayers - 1; roundNum++) {
        let previousRound = tourney.rounds[tourney.rounds.length - 1]
        let newRound: Round = {
            tables: []
        }
        for (let tableNum = 0; tableNum < previousRound.tables.length; tableNum++) {
            let newTable: Table = {
                teams: []
            }
            for (let teamNum = 0; teamNum < 2; teamNum++) {
                let newTeam: Team = {
                    players: []
                }
                for(let playerNum = 0; playerNum < 2; playerNum++) {
                    let previousPlayer = previousRound.tables[tableNum].teams[teamNum].players[playerNum]
                    if (previousPlayer < numPlayers - 1) {
                        newTeam.players.push((previousPlayer + 1) % (numPlayers - 1))
                    } else {
                        newTeam.players.push(previousPlayer)
                    }
                }
                newTable.teams.push(newTeam)
            }
            newRound.tables.push(newTable)
        }
        tourney.rounds.push(newRound)
    }
    console.log(tourney)
    return tourney
}