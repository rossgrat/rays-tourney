import { first } from "rxjs"

interface Table {
    Teams: number[][] // [Team][Player]
}

interface Round {
    ByePlayers: number[]
    UsedPlayers: Set<number>
    Tables: Table[]
}

interface Game {
    Rounds: Round[]
    Byes: number[]
}

interface GameInputs {
    NumPlayers: number
    NumRounds: number
    NumTables: number
    Mode: GameMode
}

enum GameMode {
    Custom = 1,
    MaxRounds,
    EqualByes,
}

// Attempt to find the first player and partner combination where
// 1. The partner is not the player
// 2. The player and partner have not yet been on a team togetther
// 3. The player and partner are not already on some other team in the round
function selectTeam(numPlayers: number, orderedPlayers: number[], usedPartners: Set<number>[], usedPlayers: Set<number>): number[] {
    for (let player of orderedPlayers) {
        if ((!usedPlayers.has(player)) && (usedPartners[player].size < numPlayers)) {
            for (let partner of orderedPlayers) {
                if ((player != partner) && !usedPartners[player].has(partner) && !usedPlayers.has(partner)) {
                    usedPartners[player].add(partner)
                    usedPartners[partner].add(player)
                    usedPlayers.add(player)
                    usedPlayers.add(partner)
                    return [player, partner]
                }
            }
        }
    }
    return []
}

function getUnusedPlayers(numPlayers: number, usedPlayers: Set<number>): number[] {
    let arr : number[] = []
    for (let i = 0; i < numPlayers; i ++) {
        if (!usedPlayers.has(i)) {
            arr.push(i)
        }
    }
    return arr
}

function maxDivisor(end: number, num: number): number {
    for (let i = end; i >=0; i--) {
        if (num % i == 0) {
            return i
        }
    }
    return 1
}


export function GenRounds(gi: GameInputs): Game | undefined {
    if (gi.NumPlayers < 4) {
        return undefined
    }
    let usedPartners: Set<number>[] = []
    for (let i = 0; i < gi.NumPlayers; i ++) {
        usedPartners.push(new Set())
    }

    let game: Game = {
        Rounds: [],
        Byes: new Array(gi.NumPlayers).fill(0)
    }

    const playersPerTeam = 2 
    const teamsPerTable = 2

    switch (gi.Mode) {
        case GameMode.MaxRounds:
            gi.NumTables = Math.floor(gi.NumPlayers / (playersPerTeam * teamsPerTable))
            gi.NumRounds = Number.MAX_SAFE_INTEGER
            break
        case GameMode.EqualByes:
            gi.NumTables = maxDivisor(Math.floor(gi.NumPlayers / (playersPerTeam * teamsPerTable)), gi.NumPlayers)
            gi.NumRounds = gi.NumPlayers / gi.NumTables
            break
    }



    let playerByesDesc: number[] = []
    for(let i = 0; i < gi.NumPlayers; i++) {
        playerByesDesc[i] = i
    }

    while(game.Rounds.length < gi.NumRounds) {
       let round: Round = {
        Tables: [],
        ByePlayers: [],
        UsedPlayers: new Set()
       }
        while (round.Tables.length < gi.NumTables) {
            let table: Table = {
                Teams: []
            }

            while(table.Teams.length < teamsPerTable) {
                let team: number[] = []
                team = selectTeam(gi.NumPlayers, playerByesDesc, usedPartners, round.UsedPlayers)
                team.sort()
                if (team.length == 0) {
                    if (round.Tables.length > 0) {
                        round.ByePlayers = getUnusedPlayers(gi.NumPlayers, round.UsedPlayers)
                        game.Rounds.push(round)
                    }
                    if (table.Teams.length > 0) {
                        for (let player of table.Teams[0]) {
                            round.UsedPlayers.delete(player)
                        }
                    }
                    return game
                }
                table.Teams.push(team)
            }
            round.Tables.push(table)
        }
        round.ByePlayers = getUnusedPlayers(gi.NumPlayers, round.UsedPlayers)
        for (let player of round.ByePlayers) {
            game.Byes[player] = game.Byes[player] + 1
        }

        playerByesDesc.sort(function(a: number, b: number): number {
            if (game.Byes[a] < game.Byes[b]) {
                return 1
            } else if (game.Byes[a] > game.Byes[b]) {
                return -1
            } else {
                return 0
            }
        })

        // console.log("BYES: ",game.Byes)
        // console.log("ORDER: ",playerByesDesc)
        // for(let s of usedPartners) {
        //     console.log(s)
        // }

        game.Rounds.push(round)
    }
    return game
}


export function Run() {
    for (let i = 7; i < 28; i++) {
        console.log("NUM PLAYERS: ", i)
        let gi:GameInputs = {
            NumPlayers: i,
            NumRounds: -1,
            NumTables: -1,
            Mode: GameMode.EqualByes
        }
        let game = GenRounds(gi) as Game
        console.log(game.Rounds)
        console.log(game.Byes)
    }
}


/*
    Two Options:
    1. Pick the number of rounds and the number of tables per round, some players may have more byes than others, automatic scoring system 
    2. Program optimizes the number of 


*/