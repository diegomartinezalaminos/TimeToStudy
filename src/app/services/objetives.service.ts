import { Injectable } from '@angular/core';
import { title } from 'process';
import { Objetives } from '../model/objetives';

//Persistencia de datos
import {Plugins } from '@capacitor/core';
const { Storage } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class ObjetivesService {

  objetivesList: Objetives[] = [];
  idCounter:number = 0;

  constructor() {
    //Persistencia de datos
    this.getObjetivesListFromStorage().then(
      data => this.objetivesList = data
      );
    this.getIdCounterFromStorage().then(
      data => this.idCounter = data
    );
  }

  //Devuelve el array de objetivos
  getObjetiveList(): Objetives[]{
    return this.objetivesList;
  }

  //Persistenica de datos
  public async getObjetivesListFromStorage(): Promise<Objetives[]> {
    const ret = await Storage.get({ key: 'ObjetivesList' });
    return JSON.parse(ret.value) ? JSON.parse(ret.value) : [];
    }
  public async getIdCounterFromStorage(): Promise<number> {
    const { value } = await Storage.get({ key: 'idCounter' });
    return value ? +value : 0;
  }
    

  //Devuelve el objeto de de la lista que tiene la id que se le pasa por parámetro
  public getObjetive(id: number){
    return { ...this.objetivesList.filter(t => t.id === id)[0]};
  }

  //Eliminra obb de la lista ObjetivesList
  public async deleteObjetive(id: number) {
    this.objetivesList = this.objetivesList.filter(t => t.id != id);
    await this.saveObjetivesList(this.objetivesList);
  }

  //Edit obb
  private editObbObjetive(obb:Objetives, title: string, description: string, h:number = 0, m:number = 0, s:number = 0){
    obb.title = title;
    obb.description = description;
    obb.h = h;
    obb.m = m;
    obb.s = s;
  }

  //Guardar cambios
  public async saveObjetive(x: Objetives){
    //Crea el obb si no existe en la lita
    if (x.id == undefined){ 
      x.id = this.idCounter++;
      x.complit = false;
      this.objetivesList.push(x);
    } else {  
      this.editObbObjetive(this.objetivesList.filter(t => t.id === x.id)[0], x.title, x.description, x.h, x.m, x.s);
    }
    await this.saveObjetivesList(this.objetivesList);
    await this.saveidCounter(this.idCounter);

  }

  //Persistencia
  public async saveObjetivesList(ObjetivesList: Objetives[]) {
    await Storage.set({
    key: 'ObjetivesList',
    value: JSON.stringify(ObjetivesList)
    });
  }
  public async saveidCounter(id: number) {
    await Storage.set({
    key: 'idCounter',
    value: '' + id
    });
  }
    

  //*****************************Mandar obb al final del array********************** */
  private endOfArray(id:number){
    let aux: Objetives;
    let find:boolean = false;
    for (let index = 0; index < this.objetivesList.length; index++){
      if (this.objetivesList[index].id === id){
        aux = this.objetivesList[index];
        find = true;
      }
      if (find && index < this.objetivesList.length - 1){
        this.objetivesList[index] = this.objetivesList[index + 1];
      }
    }
    this.objetivesList[this.objetivesList.length - 1] = aux;
  }

  //*****************************Cronómetro*************************** */
  //time donde almacenamos los valores del cronómetro (la varible cambia cada segundo hasta llegar de nuevo a 0) 
  time = {
    s:0,
    m:0,
    h:0,
    start:false,
    fin:false,
    id:-1
  }

  goTime(id: number){

    //Obtenemos el tiempo que hemos puesto a la actividad
    if (this.time.s === 0 && this.time.m === 0 && this.time.h === 0){
    this.time.s = this.objetivesList.filter(t => t.id === id)[0].s;
    this.time.m = this.objetivesList.filter(t => t.id === id)[0].m;
    this.time.h = this.objetivesList.filter(t => t.id === id)[0].h;
    this.time.id = id;
    this.time.start = true;
    }
    
    //Cronómetro decreciente
    if (this.time.s === 0 && (this.time.m > 0 || this.time.h > 0)){
      this.time.s = 60;
      if (this.time.m === 0 && this.time.h > 0){
        this.time.m = 60;
        this.time.m --;
        this.time.h --;
      } else if (this.time.m > 0){
        this.time.m --;
      }

    } else if (this.time.s > 0){
      this.time.s --;
    }
    //Comprobamos si el cronómetro ha llegado a cero    
    if (this.time.h === 0 && this.time.m === 0 && this.time.s === 0){
      //console.log(this.time.h + ":" + this.time.m + ":" + this.time.s);
      this.time.fin = true;
      this.objetivesList.filter(t => t.id === id)[0].complit = true;
      this.time.start = false;
      this.endOfArray(id);
    } else {
      //Cada segundo ejecutamos la función en el caso de que el cronómetro no haya llegado a 0
      setTimeout(() => {
        this.goTime(id);
      }, 1000);
    }
  }

  //*****************************Orden de prioridad en array************************/
  //Le subimos o restamos una posicion en el array al objeto que se pasa por parámentro
  async priorityUpDown (upDown:string, obb:Objetives){
    if (upDown === 'up'){
      let position:number;
      let aux: Objetives;
      for (let index = 0; index < this.objetivesList.length; index++){
        if(this.objetivesList[index] === obb){
          position = index;
        }
      }
      aux = this.objetivesList[position - 1];
      this.objetivesList[position - 1] = obb;
      this.objetivesList[position] = aux;

    }else if (upDown === 'down'){
      let position:number;
      let aux: Objetives;
      for (let index = 0; index < this.objetivesList.length; index++){
        if(this.objetivesList[index] === obb){
          position = index;
        }
      }
      aux = this.objetivesList[position + 1];
      this.objetivesList[position + 1] = obb;
      this.objetivesList[position] = aux;
    }
    await this.saveObjetivesList(this.objetivesList);
  }


}
