import { NgForOf, NgForOfContext } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Objetives } from '../model/objetives';
import { ObjetivesService } from '../services/objetives.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  objetivesList: Objetives[] = [];
  time = {
    s:0,
    m:0,
    h:0,
    start: false,
    fin:false,
    id:-1
  }

  constructor
  (
    private router: Router,
    private objetivesService: ObjetivesService,
    private alertController: AlertController
  )
  {

  }

  ngOnInit(){
    this.objetivesList = this.objetivesService.getObjetiveList();
  }

  ionViewWillEnter(){
    this.objetivesList = this.objetivesService.getObjetiveList();
  }

  goEditObjetives(id:number){
    this.router.navigateByUrl(`/edit${id != undefined ? '/' + id: ''}`);
  }


  //Esta funcion se usa para comprobar si el obb siguiente al pasado por parámetro ha sido completado o no
  //Se usará para motras o ocultar el icono de la flecha segun el caso
  downArrow(obb:Objetives): boolean{
    for (let index = 0; index < this.objetivesList.length; index++){
      if (this.objetivesList[index] === obb){
        if(index === this.objetivesList.length - 1){
          return false;
        }else if(this.objetivesList[index + 1].complit){
          return true;
        }else{
          return false;
        }
      }
    }
  }

  //Borrar obb
  deleteObjetive(id: number){
    this.objetivesService.deleteObjetive(id);
    this.objetivesList = this.objetivesService.getObjetiveList();
  }

  //Recarga variable
  private recarga(s:number){
    if (!this.time.fin){
      setTimeout(() => {
        this.time = this.objetivesService.time;
      }, s);
      
    }
  }

  //Inicia un cronomentro
  startTime(id:number){
    this.objetivesService.goTime(id);
    this.recarga(1000);
  }

  //Cambiar prioridad (cambiar la posiscion de los elementos en la array)
  priorityUpDown(upDown:string, obb:Objetives){
    this.objetivesService.priorityUpDown(upDown, obb);
  }

  async info(t: Objetives) {
    const alert = await this.alertController.create({
      message: `<strong>Título </strong><ion-icon name="reader-outline"></ion-icon>: <br> ${t.title}<br><br><strong>Descripcion </strong><ion-icon name="information-circle-outline"></ion-icon>:<br>${t.description}<br><br><strong>Tiempo </strong><ion-icon name="alarm-outline"></ion-icon>:<br>${t.h + ":" + t.m + ":" + t.s}`,
    });

    await alert.present();
  }

  async deleteAlert(t: Objetives) {
    const alert = await this.alertController.create({
      header: 'DELETE:',
      message: `Estas seguro de que quieres borrar la tarea <strong>"${t.title}"</strong>`,
      buttons: [
        {
          text: 'CANCELAR',
        }, {
          text: 'CONTINUAR',
          handler: () => {
            this.deleteObjetive(t.id);
          }
        }
      ]
    });
    await alert.present();
  }


}
