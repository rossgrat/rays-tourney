export interface Table {
    Teams: number[][] // [Team][Player]
}

export interface Round {
    ByePlayers: number[]
    UsedPlayers: Set<number>
    Tables: Table[]
}

export interface Tourney {
    Rounds: Round[]
    Byes: number[]
}

export interface TourneyInputs {
    NumPlayers: number
    NumRounds: number
    NumTables: number
    Mode: GameMode
}

export enum GameMode {
    Custom = 1,
    MaxRounds,
    EqualByes,
}

// Attempt to find the first player and partner combination where
// 1. The partner is not the player
// 2. The player and partner have not yet been on a team togetther
// 3. The player and partner are not already on some other team in the round
//
// Iterate over the array of ordered players when attempting to seat a player
// and their partner.
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


export function CreateTourney(ti: TourneyInputs): Tourney {
    // A minimum of 4 players are required for euchre
    if (ti.NumPlayers < 4) {
        let empty: Tourney = {
            Rounds: [],
            Byes: []
        }
        return empty
    }
    // Create a set for each player of other players they have partnered with
    let usedPartners: Set<number>[] = []
    for (let i = 0; i < ti.NumPlayers; i ++) {
        usedPartners.push(new Set())
    }

    const playersPerTeam = 2 
    const teamsPerTable = 2

    // We currently recognize two game modes
    // MaxRounds: Generate the maximum number of rounds using the maximum number of tables
    // Custom: Use inputs for numRounds and numTables to generate rounds
    switch (ti.Mode) {
        case GameMode.MaxRounds:
            ti.NumTables = Math.floor(ti.NumPlayers / (playersPerTeam * teamsPerTable))
            ti.NumRounds = Number.MAX_SAFE_INTEGER
            break
            
        case GameMode.Custom:
            if (ti.NumRounds === -1) {
                ti.NumRounds = Number.MAX_SAFE_INTEGER
            }
            if (ti.NumTables === -1) {
                ti.NumTables = Math.floor(ti.NumPlayers / (playersPerTeam * teamsPerTable))
            }
            break
    }

    // Create an array of all player IDs
    let playerByesDesc: number[] = []
    for(let i = 0; i < ti.NumPlayers; i++) {
        playerByesDesc[i] = i
    }

    let tourney: Tourney = {
        Rounds: [],
        Byes: new Array(ti.NumPlayers).fill(0)
    }
    // Create a tourney of numRounds where each round has numTables of two teams and two players per team
    while(tourney.Rounds.length < ti.NumRounds) {
       let round: Round = {
        Tables: [],
        ByePlayers: [],
        UsedPlayers: new Set()
       }
        while (round.Tables.length < ti.NumTables) {
            let table: Table = {
                Teams: []
            }
            while(table.Teams.length < teamsPerTable) {
                let team: number[] = []
                team = selectTeam(ti.NumPlayers, playerByesDesc, usedPartners, round.UsedPlayers)
                team.sort()
                // If we are unable to select a team, we must be out of usable partner
                // combinations. Add the current round to the tourney if any tables have
                // already been seated and return the tourney
                if (team.length == 0) {
                    if (round.Tables.length > 0) {
                        round.ByePlayers = getUnusedPlayers(ti.NumPlayers, round.UsedPlayers)
                        for (let player of round.ByePlayers) {
                            tourney.Byes[player] = tourney.Byes[player] + 1
                        }
                        tourney.Rounds.push(round)
                    }
                    if (table.Teams.length > 0) {
                        for (let player of table.Teams[0]) {
                            round.UsedPlayers.delete(player)
                        }
                    }
                    return tourney
                }
                table.Teams.push(team)
            }
            round.Tables.push(table)
        }
        round.ByePlayers = getUnusedPlayers(ti.NumPlayers, round.UsedPlayers)
        for (let player of round.ByePlayers) {
            tourney.Byes[player] = tourney.Byes[player] + 1
        }

        // Sort the player ID array by byes where players with smaller numbers of byes
        // are first in line to be selected for a team
        playerByesDesc.sort(function(a: number, b: number): number {
            if (tourney.Byes[a] < tourney.Byes[b]) {
                return 1
            } else if (tourney.Byes[a] > tourney.Byes[b]) {
                return -1
            } else {
                return 0
            }
        })

        tourney.Rounds.push(round)
    }
    return tourney
}