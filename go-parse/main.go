package main

import (
	"encoding/json"
	"fmt"
	"os"
	"regexp"
	"strconv"
)

// Parse durango bill starting blocks into JSON

type AllBlocks struct {
	Blocks []Block `json:"blocks"`
}

type Block struct {
	NumPlayers int   `json:"numPlayers"`
	StartRound Round `json:"startRound"`
}

type Round struct {
	Tables []Table `json:"tables"`
}
type Table struct {
	Teams []Team `json:"teams"`
}
type Team struct {
	Players []int `json:"players"`
}

func main() {

	tablesReg := regexp.MustCompile("([0-9])+ +and +([0-9])+ + vs. +([0-9])+ +and +([0-9])+")
	teamsReg := regexp.MustCompile("([0-9])+ +and +([0-9])+")
	playersReg := regexp.MustCompile("([0-9])+")

	cont := ""
	for {
		fmt.Println("Done? (Y/n): ")
		// Check if the command loop is done
		num, err := fmt.Scanln(&cont)
		if num > 1 {
			if err != nil {
				panic(err)
			}
		}
		if cont == "Y" {
			return
		}

		// Load the starting blocks from the input.txt file
		inputBytes, err := os.ReadFile("input.txt")
		if err != nil {
			panic(err)
		}
		inputStr := string(inputBytes)

		// Load any existing blocks into the
		var blocks AllBlocks
		existingBlocksBytes, err := os.ReadFile("blocks.json")
		if err == nil {
			if err := json.Unmarshal(existingBlocksBytes, &blocks); err != nil {
				panic(err)
			}
		} else {
			fmt.Println("Did not find existing blocks.")
		}

		// Parse the starting blocks into data structures
		tables := tablesReg.FindAllString(inputStr, -1)
		var newRound Round
		for _, table := range tables {
			var newTable Table
			teams := teamsReg.FindAllString(table, -1)
			for _, team := range teams {
				var newTeam Team
				players := playersReg.FindAllString(team, -1)
				for _, player := range players {
					p, err := strconv.Atoi(player)
					if err != nil {
						panic(err)
					}
					newTeam.Players = append(newTeam.Players, p)
				}
				newTable.Teams = append(newTable.Teams, newTeam)
			}
			newRound.Tables = append(newRound.Tables, newTable)
		}

		newBlock := Block{
			NumPlayers: len(tables) * 4,
			StartRound: newRound,
		}
		blocks.Blocks = append(blocks.Blocks, newBlock)

		// Marshal the blocks object and write it
		blocksStr, err := json.Marshal(&blocks)
		if err != nil {
			panic(err)
		}
		if err := os.WriteFile("blocks.json", []byte(blocksStr), 0666); err != nil {
			panic(err)
		}
	}
}
