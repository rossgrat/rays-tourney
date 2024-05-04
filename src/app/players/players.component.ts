import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import {Run} from '../tourney-engine-2'

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './players.component.html'
})
export class PlayersComponent {

  namesList: string[] = []

  addPlayersForm = new FormGroup({
    name: new FormControl('')
  })

  addPlayers() {
    let newName: string = this.addPlayersForm.value.name ?? 'New Player'
    this.namesList.unshift(newName)
    this.addPlayersForm.reset()
  }

  runTest() {
    console.log("STARTING RUN")
    Run()
  }
}
