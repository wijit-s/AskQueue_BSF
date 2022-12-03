import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { LoginService } from '../../service/login.service';
import { NgxSpinnerService } from "ngx-spinner"; 
import { Router } from '@angular/router';
@Component({
  selector: 'app-canclequeue',
  templateUrl: './canclequeue.component.html',
  styleUrls: ['./canclequeue.component.css']
})
export class CanclequeueComponent implements OnInit {

  userdata:any;
  constructor(private userlogin:LoginService,private spinner: NgxSpinnerService,private router:Router) { 
    this.userdata = this.userlogin.Loadlocal();
    if (this.userdata == null || this.userdata == undefined || this.userdata == [])
    {
      this.router.navigateByUrl("/login");
    }
  }

  ngOnInit(): void {
    this.LoadqueList();
  }


  // โหลด Q list
  qlist:any;
  LoadqueList(){
    axios.get("https://asia-southeast2-brr-farmluck.cloudfunctions.net/dbcps/select_s_f_w?s=*&f=[dbQBRD].[dbo].[v_qcard6566]&w=[Qtype]=6 and[print_q]in(1,2)")
    .then(res =>
      {this.spinner.show();
      this.qlist = res.data.recordset;
      this.spinner.hide();
    })
    .catch(err => {throw err})
  }

  // ยกเลิกคิว
  CancleQue(id:any){
    let url = "https://asia-southeast2-brr-farmluck.cloudfunctions.net/app_farmer/canceled_qcard?canceled_by="+this.userdata[0].supcode+"&truck_q="+id;
    if(confirm('ต้องการยกเลิกคิว' + id +'หรือไม่ ?')==true){
      axios.post(url).then(res =>{
        if(res.data.rowsAffected[0] == 1){
          alert("ยกเลิกข้อมูลคิวแล้ว");
          this.LoadqueList();
        }
        else if (res.data.rowsAffected[0] == 0)
        { alert("!!กรุณาลองใหม่ ยกเลิกรายการไม่สำเร็จ!!"); }
        else if (res.data.code)
        { alert("!!กรุณาลองใหม่ ยกเลิกรายการไม่สำเร็จ!!") }
        }).catch(err => {throw(err)});
    }
    else{}
   
  }

}
