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
  @Input() players: string[] = [];
  @Input() tourney: Tourney = {
    Rounds: [],
    Byes: []
  }

  notEnoughPlayers = false

  ngOnInit(){
    console.log(this.players)
    console.log(this.tourney)
  }

  endTournament() {
    this.tourney =  {
      Rounds: [],
      Byes: []
    }
    this.sendRestart.emit(true)
  }
}

