import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  myactive:any;
  constructor(private router:Router,private lactive:LoginService) {
    this.myactive = this.lactive.LoadActiveside();
    this.active = this.myactive;
   }

  ngOnInit(): void {
  }

  active = 0;

  goLogout(){
    if(confirm("ต้องการออกจากระบบ ?")==true){this.router.navigateByUrl("/login"); localStorage.clear();}
    else{console.log('cancle');}
    
  }

  goMainBoard(){
    this.active = 1;
    localStorage.setItem('active', JSON.stringify(this.active));
    this.router.navigateByUrl('/fardashboard');
  }

  goCancleQueue(){
    this.active = 2;
    localStorage.setItem('active', JSON.stringify(this.active));
    this.router.navigateByUrl('/cancleQ');
  }

  goMangetruck(){
    this.active = 3;
    localStorage.setItem('active', JSON.stringify(this.active));
    this.router.navigateByUrl('/managestruck');
  }

}
