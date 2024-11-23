import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login: FormGroup;
  constructor(private router: Router) {
    this.getIP();
    this.login = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
    });
  }

  ngOnInit(): void {

  }

  username: any;
  password: any;
  userlevel: any;
  Loaddata() {
    var userinfor = this.login.get('username')?.value;
    let password = this.login.get('password')?.value;

    // console.log(userinfor);
    let url = `https://asia-southeast2-brr-farmluck.cloudfunctions.net/dbcps/get_users_s?user=${userinfor}&pass=${password}`;
    axios.get(url)
      .then((res: any) => {
        const data = res.data.recordset;
        if (data.length > 0) {
          this.username = data[0].username;
          this.userlevel = data[0].userlevel;
          console.log(data[0]);
          localStorage.setItem('userdata', JSON.stringify(data));
          if (this.userlevel == 71 || this.userlevel == 70) { this.gokeepdata(); this.router.navigateByUrl("/fardashboard"); }
          else { alert("ระดับ user ไม่ถูกต้อง"); }
        }
        else { alert("ชื่อผู้ใช้งาน หรือ รหัสผ่าน ไม่ถูกต้อง!"); }

      })
      .catch(err => { throw err });
  }

  goLogin() {
    let user = this.login.get('username')?.value;
    let password = this.login.get('password')?.value;
    console.log(this.login.value);
    localStorage.setItem('active', JSON.stringify(1));
    if (user == null && password == null) { alert('กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน'); }
    else if (user == null || user == '') { alert('กรุณากรอกชื่อผู้ใช้งาน'); }
    else if (password == null || password == '') { alert('กรุณากรอกรหัสผ่าน'); }
    //else if (password !== this.password) { alert("รหัสผ่าน ไม่ถูกต้อง!"); }
    //else if (this.userlevel == 71 || this.userlevel == 70) { this.gokeepdata(); this.router.navigateByUrl("/fardashboard"); }
    // else if (this.userlevel == 70){ this.gokeepdata(); this.router.navigateByUrl("/maindashboard"); }
    else { this.Loaddata() }
  }

  // ค้นหาา Ip Address
  ipAddress = '';
  dayonlogin: any;
  getIP() {
    // let url = "http://api.ipify.org/?format=json"; // ip only
    let url2 = "https://geolocation-db.com/json/";
    axios.get(url2)
      .then(res => {
        console.log(res.data);
        this.ipAddress = res.data.IPv4;
      }).catch((error: any) => { throw (error) });

    let test = new Date();
    let test2 = test.getFullYear() + "-" +
      ("0" + (test.getMonth() + 1)).slice(-2) + "-" +
      ("0" + test.getDate()).slice(-2) + " " +
      ("0" + test.getHours()).slice(-2) + ":" +
      ("0" + test.getMinutes()).slice(-2) + ":" +
      ("0" + test.getSeconds()).slice(-2);

    this.dayonlogin = test2;
  }

  gokeepdata() {
    let user = this.login.get('username')?.value;
    let url = "https://asia-southeast2-brr-farmluck.cloudfunctions.net/dbcps/insert_zonelogin?datelogin='" + this.dayonlogin + "'&supcode='" + user + "'&zoneip='" + this.ipAddress
      + "'&web=%27https://farmer-brr.web.app/%27";

    axios.post(url)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => { throw (err) })
  }

  resetForm() {
    this.login.reset();
  }

}
