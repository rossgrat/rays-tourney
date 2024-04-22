import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-Players',
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
    this.namesList.unshift(this.addPlayersForm.value.name ?? 'New Player')
    this.addPlayersForm.reset()
  }
}
