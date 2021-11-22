import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }


  Loadlocal(){
    var data:any = localStorage.getItem('userdata');
    return JSON.parse(data);
  }
}
