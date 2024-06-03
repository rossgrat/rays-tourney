import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { PlayersComponent } from './players/players.component'
import { TourneyComponent } from './tourney/tourney.component';
import {
  Tourney, 
  GenerateTouurnament,
  ParseStartBlocks
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
  playerNames: string[] = []
  tourney: Tourney= {
    rounds: []
  }

  ngOnInit() {
    ParseStartBlocks()
  }

  onReceivedPlayers(receivedPlayers: string[]) {
    this.playerNames = receivedPlayers
    if (this.playerNames.length % 4 === 0) {
      this.tourney = GenerateTouurnament(this.playerNames.length)
    } else {
      this.tourney = {
        rounds: []
      }
    }
    this.showAddPlayers = !this.showAddPlayers
  }

  onRecievedRestart(start: boolean ) {
    this.tourney = {
      rounds: []
    }
    this.showAddPlayers = !this.showAddPlayers
  }
}
