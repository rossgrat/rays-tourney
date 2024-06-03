import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  Tourney, 
  Round,
  Table,
} from '../tourney-engine'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-tourney',
  standalone: true,
  imports: [ 
    CommonModule
   ],
  templateUrl: './tourney.component.html',
  styleUrl: '../../styles.css'
})
export class TourneyComponent {
  @Output() sendRestart = new EventEmitter<boolean>()
  @Input() playerNames: string[] = [];
  @Input() tourney: Tourney = {
    rounds: []
  }

  notEnoughPlayers = false

  endTournament() {
    this.tourney =  {
      rounds: []
    }
    this.sendRestart.emit(true)
  }
}

