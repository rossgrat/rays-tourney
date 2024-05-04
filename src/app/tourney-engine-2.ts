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
}


// Attempt to find the first player and partner combination where
// 1. The partner is not the player
// 2. The player and partner have not yet been on a team togetther
// 3. The player and partner are not already on some other team in the round
function selectTeam(numPlayers: number, usedPartners: Set<number>[], usedPlayers: Set<number>): number[] {
    for (let player = 0; player < numPlayers; player++) {
        if ((!usedPlayers.has(player))&& (usedPartners[player].size < numPlayers)) {
            for (let partner = 0; partner < numPlayers; partner++) {
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

export function GenRounds(numPlayers: number): Round[] {
    let usedPartners: Set<number>[] = []
    for (let i = 0; i < numPlayers; i ++) {
        usedPartners.push(new Set())
    }

    let rounds: Round[] = []

    const playersPerTeam = 2
    const teamsPerTable = 2
    let numTables: number = Math.floor(numPlayers / (playersPerTeam * teamsPerTable))

    while(true) {
       let round: Round = {
        Tables: [],
        ByePlayers: [],
        UsedPlayers: new Set()
       }
        while (round.Tables.length < numTables) {
            let table: Table = {
                Teams: []
            }
            while(table.Teams.length < teamsPerTable) {
                let team = selectTeam(numPlayers, usedPartners, round.UsedPlayers)
                if (team.length == 0) {
                    return rounds
                }
                table.Teams.push(team)
            }
            round.Tables.push(table)
        }
        round.ByePlayers = getUnusedPlayers(numPlayers, round.UsedPlayers)
        rounds.push(round)
    }

}

export function Run() {
    let rounds = GenRounds(27)
    console.log(rounds)
}
