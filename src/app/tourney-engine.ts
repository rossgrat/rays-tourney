
interface GameInputs {
    NumPlayers: number
    PlayersPerTeam: number
    TeamsPerTable: number
}

interface GameData {
    NumTables: number
    NumRounds: number
    ExtraPlayers: number
    ByeStart: number
    Teams: number[][]
    UsedTeams: Set<number>
}


interface Table {
    Teams: number[] // [Team][Player]
}

interface Round {
    ByePlayers: number[]
    UsedPlayers: Set<number>
    Tables: Table[]
}

interface Game {
    Rounds: Round[]
}

 // Utility functions
function copyArray(arr: number[]): number[] {
    let newArr: number[] = []
    for (let i = 0; i < arr.length; i++) {
        newArr.push(arr[i])
    }
    return newArr
}

function generate(n: number, k: number, start: number, arr: number[], combs: number[][]) {
    if (arr.length == k) {
        combs.push(copyArray(arr))
        return
    }
    
    let need: number = k - arr.length
    let remain: number = n - start
    let available: number = remain - need
    for (let val: number = start; val <= start + available; val++) {
        arr.push(val)
        generate(n, k, val + 1, arr, combs)
        arr.pop()
    }
}

export function GenCombinations(gi: GameInputs): number[][] {
    let combs: number[][] = []
    let arr: number[] = []
    generate(gi.NumPlayers, gi.PlayersPerTeam, 0, arr, combs)
    console.log(combs)
    return combs
}

// A team is valid if:
// - No player on any team currently has a byte
// - No player on any team is also a player on another different team
function checkPlayersValid(team: number[], usedPlayers: Set<number>): boolean {
    for (let p of team) {
        if (usedPlayers.has(p)) {
            return false
        }
    }
    return true
}


function addByePlayersToSet(gi: GameInputs, byeStart: number, extraPlayers: number, usedPlayers: Set<number>){
    let count = 0
    for(let i = byeStart; count < extraPlayers; i = (i + 1) % gi.NumPlayers) {
        usedPlayers.add(i)
        count++
    }
}

function findMissingPlayers(gi: GameInputs, usedPlayers: Set<number>): number[] {
    let byePlayers: number[] = []
    for (let i = 0; i < gi.NumPlayers; i ++) {
        if (usedPlayers.has(i)) {
            byePlayers.push(i)
        }
    }
    return byePlayers
}

function genGameData(gi: GameInputs, teams: number[][]): GameData {
    // TODO: Configure the number of rounds such that each person has an equal number of byes (plays an equal number of games)
    let gd: GameData = {
        NumTables: 0,
        NumRounds: 0,
        ExtraPlayers: 0,
        ByeStart: 0,
        Teams: teams,
        UsedTeams: new Set()
    }
    gd.NumTables = Math.floor(gi.NumPlayers / (gi.PlayersPerTeam * gi.TeamsPerTable))
    gd.NumRounds = Math.floor(teams.length / gi.PlayersPerTeam / gd.NumTables)
    gd.ExtraPlayers = gi.NumPlayers % (gi.PlayersPerTeam * gi.TeamsPerTable * gd.NumTables)
    return gd
}


function seatTeams(gi: GameInputs, gd: GameData, table: Table, round: Round, game: Game): boolean {
    if (game.Rounds.length == gd.NumRounds) {
        return true
    }
    if (round.Tables.length == gd.NumTables) {
        round.ByePlayers = findMissingPlayers(gi,round.UsedPlayers)
        game.Rounds.push(round)
        let oldByeStart = gd.ByeStart
        gd.ByeStart = (gd.ByeStart + gd.ExtraPlayers) % gi.NumPlayers

        console.log("ROUND: ", game.Rounds.length)
        console.log(round)

        let newRound: Round = {
            ByePlayers: [],
            Tables: [],
            UsedPlayers: new Set()
        }
        if (seatTeams(gi, gd, table, newRound, game)) {
            return true
        }
        console.log("BACKTRACK ROUND: ", game.Rounds.length)
        // Backtrack if not done
        gd.ByeStart = oldByeStart
        game.Rounds.pop()
        return false
    }
    if (table.Teams.length == gi.TeamsPerTable) {
        round.Tables.push(table)

        console.log("TABLE: ", round.Tables.length)
        console.log(round)

        let newTable: Table = {
            Teams: []
        }
        if (seatTeams(gi, gd, newTable, round, game)) {
            return true
        }
        console.log("BACKTRACK TABLE: ", round.Tables.length)
        // Backtrack if not done
        round.Tables.pop()
        return false
    }
    for (let teamNum = 0; teamNum < gd.Teams.length; teamNum++) {
        let team = gd.Teams[teamNum]
        if (checkPlayersValid(team, round.UsedPlayers) && !gd.UsedTeams.has(teamNum)) {

            table.Teams.push(teamNum)
            gd.UsedTeams.add(teamNum)
            for (let p of team) {
                round.UsedPlayers.add(p)
            }

            console.log("TEAMS: ", table.Teams.length)
            console.log(table)

            if (seatTeams(gi, gd, table, round, game)) {
                return true
            }
            console.log("BACKTRACK TEAMS: ", table.Teams.length)

            // Backtrack if not done
            table.Teams.pop()
            gd.UsedTeams.delete(teamNum)
            for (let p of team) {
                round.UsedPlayers.delete(p)
            }
        }
    }
    return false
}

export function GenRounds(gi: GameInputs, gd: GameData): Game {
    let game: Game = {
        Rounds: []
    }
    let usedPlayers: Set<number> = new Set()
    addByePlayersToSet(gi, gd.ByeStart, gd.ExtraPlayers, usedPlayers)
    let round: Round = {
        ByePlayers: Array.from(usedPlayers),
        Tables: [],
        UsedPlayers: usedPlayers
    }
    let table: Table = {
        Teams: []
    }
    if (!seatTeams(gi, gd, table, round, game)) {
        console.log("Error - failed to create rounds")
    }

    return game
}


export function Run() {
    let inputs: GameInputs = {
        NumPlayers: 10,
        PlayersPerTeam: 2,
        TeamsPerTable: 2
    }
    let data = genGameData(inputs, GenCombinations(inputs))

    console.log(inputs, data)

    let rounds = GenRounds(inputs, data)
    console.log(rounds)
}
