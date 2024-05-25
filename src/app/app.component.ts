import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { PlayersComponent } from './players/players.component'
import { TourneyComponent } from './tourney/tourney.component';
import {
  Tourney, 
  TourneyInputs,
  CreateTourney,
  GameMode
} from './tourney-engine'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule, 
    PlayersComponent,
    TourneyComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: '../styles.css'
})
export class AppComponent {
  title = 'Euchre Tournament Generator';

  showAddPlayers = true
  players: string[] = []
  tourney: Tourney= {
    Rounds: [],
    Byes: []
  }

  onReceivedPlayers(receivedPlayers: string[]) {
    this.players = receivedPlayers
    let ti:TourneyInputs = {
      NumPlayers: this.players.length,
      NumRounds: -1,
      NumTables: -1,
      Mode: GameMode.MaxRounds
    }
    this.tourney = CreateTourney(ti)
    this.showAddPlayers = !this.showAddPlayers
  }

  onRecievedRestart(start: boolean ) {
    this.tourney = {
      Rounds: [],
      Byes: []
    }
    this.showAddPlayers = !this.showAddPlayers
  }
}
