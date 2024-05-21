import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'RECETAS ALREDEDOR DEL MUNDO';

  windowScrolled!: boolean;

  //* Se inyecta el objeto 'Document' ya que para manejar el scroll se trabaja directamente con el DOM
  constructor(@Inject(DOCUMENT) private document: Document) {}

  //* Se asigna un listener al evento scroll y se llama al método onWindowScroll cada que detecta un cambio en este
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.windowScrolled = window.scrollY || this.document.documentElement.scrollTop || this.document.body.scrollTop > 100 ? true 
      : this.windowScrolled && window.scrollY || this.document.documentElement.scrollTop || this.document.body.scrollTop < 10 ? false : true    
  } 

  scrollToTop() {
    (function smoothscroll() {
      var currScroll = document.documentElement.scrollTop || document.body.scrollTop      
      if (currScroll > 0) {
        window.requestAnimationFrame(smoothscroll)
        window.scrollTo(0, currScroll - (currScroll / 1))
      }
    })()
  }
}