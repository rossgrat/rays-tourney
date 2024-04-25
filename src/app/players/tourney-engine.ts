
interface GameInputs {
    NumPlayers: number
    PlayersPerTeam: number
    TeamsPerGame: number
}

interface Table {
    Teams: number[][] // [Team][Player]
}

interface Round {
    ByePlayers: number[]
    Tables: Table[]
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
    console.log("COMBS")
    console.log(combs)
    return combs
}

// A team is valid if:
// - No player on any team currently has a byte
// - No player on any team is also a player on another different team
function checkTeamValid(team: number[], byePlayers: Set<number>, usedPlayers: Set<number>): boolean {
    for (let p of team) {
        if (byePlayers.has(p)){
            return false
        }
        if (usedPlayers.has(p)) {
            return false
        }
        usedPlayers.add(p)
    }
    return true
}

function createByePlayers(gi: GameInputs, byeStart: number, extraPlayers: number): Set<number> {
    let set: Set<number> = new Set()
    let count = 0
    for(let i = byeStart; count < extraPlayers; i = (i + 1) % gi.NumPlayers) {
        set.add(i)
        count++
    }
    return set
}

export function GenRounds(gi: GameInputs, teams: number[][]): Round[] {
    let numTables: number = Math.floor(gi.NumPlayers / (gi.PlayersPerTeam * gi.TeamsPerGame))
    // TODO: Configure the number of rounds such that each person has an equal number of byes
    let numRounds: number = Math.floor(teams.length / gi.PlayersPerTeam / numTables)
    let byeStart: number = 0
    let extraPlayers: number = gi.NumPlayers % (gi.PlayersPerTeam * gi.TeamsPerGame * numTables)

    console.log(numTables)
    console.log(numRounds)
    console.log(byeStart)

    let rounds: Round[] = []
    // For each round, fill all of the tables with teams and 
    // pick players with byes
    for (let roundNum = 0; roundNum < numRounds; roundNum++) {
        console.log("ROUND: "+roundNum)
        let byePlayers: Set<number> = createByePlayers(gi, byeStart, extraPlayers)
        let round: Round = {
            ByePlayers: Array.from(byePlayers),
            Tables: []
        }
        console.log("BYE PLAYERS: "+round.ByePlayers)
        // For each table, fill each seat with a team
        for(let tableNum = 0; tableNum < numTables; tableNum++) {
            console.log("TABLE: "+tableNum)
            let usedPlayers: Set<number> = new Set()
            let table: Table = {
                Teams: []
            }
            // For each seat, pick a team where:
            // - No player is on both teams
            // - No player currently has a byte
            for (let seatNum = 0; seatNum < gi.TeamsPerGame; seatNum++) {
                console.log("SEAT: "+seatNum)
                for (let teamNum = 0; teamNum < teams.length; teamNum++) {
                    console.log("TEAM CHECK: "+ teams[teamNum])
                    if (checkTeamValid(teams[teamNum], byePlayers, usedPlayers)) {
                        let team = copyArray(teams[teamNum])
                        table.Teams.push(team)
                        for (let p of team) {
                            usedPlayers.add(p)
                        }
                        teams.splice(teamNum, 1)
                        console.log("FOUND TEAM: " + team)
                        console.log(usedPlayers)
                        break
                    }
                }

            }
            round.Tables.push(table)
        }
        rounds.push(round)
        // Increment byeStart and byeEnd
        byeStart = (byeStart + extraPlayers) % gi.NumPlayers
    }
    return rounds
}

export function Run() {
    let gi: GameInputs = {
        NumPlayers: 6,
        PlayersPerTeam: 2,
        TeamsPerGame: 2
    }
    let teams = GenCombinations(gi)
    let rounds = GenRounds(gi, teams)
    console.log(rounds)
}