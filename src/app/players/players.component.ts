import { Component, EventEmitter, Output, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './players.component.html',
  styleUrl: '../../styles.css'
})
export class PlayersComponent {

  @Input() existingPlayers: string[] = []
  @Output() sendPlayers = new EventEmitter<string[]>()

  players: string[] = [  ]
  addPlayersForm = new FormGroup({
    name: new FormControl('')
  })

  ngOnInit() {
    this.players = this.existingPlayers
  }

  addPlayer() {
    if (this.players.length === 100) {
      alert("Maximum of 100 players allowed.")
      return
    }
    let newName = this.addPlayersForm.value.name
    if (newName === undefined || newName === null || newName === "") {
      newName = "New Player"
    } else {
      if (newName.length > 20) {
          alert("Names must be 20 characters or less.")
          return
      }
    }
    this.players.unshift(newName)
    this.addPlayersForm.reset()
  }

  removePlayer(i: number) {
    this.players.splice(i, 1)
  }

  finishedAddingPlayers() {
    this.sendPlayers.emit(this.players)
  }
}
