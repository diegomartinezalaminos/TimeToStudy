import { ValueTransformer } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//import { time } from 'console';
import { Objetives } from 'src/app/model/objetives';
import { ObjetivesService } from 'src/app/services/objetives.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})

export class EditPage implements OnInit {

  time: string = '';

  objetive: Objetives = {title:'', description:'', h:0, m:0, s:0};

  constructor
  (
    private objetivesService: ObjetivesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  )
  {

  }

  
  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id != null) {
      this.objetive = this.objetivesService.getObjetive(+id);
    }
  }


  saveObjetive(){
    this.objetivesService.saveObjetive(this.objetive);
    this.router.navigateByUrl('/');
  }

  addTime(){
    this.objetive.h = parseInt(this.time.split('.')[0].split('T')[1].split(':')[0]);
    this.objetive.m = parseInt(this.time.split('.')[0].split('T')[1].split(':')[1]);
    this.objetive.s = parseInt(this.time.split('.')[0].split('T')[1].split(':')[2]);
    console.log(this.objetive.h + ':' + this.objetive.m + ':' + this.objetive.s);
  }
}