import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private readonly router: Router) {}

  alphabet: string = 'abcdefghijklmnopqrstuvwxyz'
  letters: string[] = this.alphabet.split('')
  inputNameValue!: string

  imgPath: string = `${environment.imagesPath}`

  //* 2. Se asigna y envía el parámetro a la ruta mediante queryParams (pasar a MealsComponent para el paso 3)
  @Output() clickedButton = new EventEmitter<string>()
  setButtonValue(value: string) {
    this.clickedButton.emit(value)    
    this.router.navigate([`recipes/list-by-letter`], { queryParams: { l: `${value}` }})       
  }

  @Output() inputValue = new EventEmitter<string>()
  setInputValue(value: string) {
    this.inputNameValue = value
    this.inputValue.emit(this.inputNameValue)    
    this.router.navigate(['recipes/list-by-name'], { queryParams: { n: `${this.inputNameValue.toLowerCase()}` } })
  }
}