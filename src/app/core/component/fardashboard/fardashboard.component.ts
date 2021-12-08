import { LoginService } from './../../service/login.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import axios from 'axios';
import { BarcodeScannerLivestreamComponent } from 'ngx-barcode-scanner';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $ :any;
@Component({
  selector: 'app-fardashboard',
  templateUrl: './fardashboard.component.html',
  styleUrls: ['./fardashboard.component.css']
})
export class FardashboardComponent implements OnInit {

  @ViewChild(BarcodeScannerLivestreamComponent)
  barcodeScanner: BarcodeScannerLivestreamComponent = new BarcodeScannerLivestreamComponent;
  barcodeValue:any;

  barcode_type="code_128"
  userdata:any;
  FormOne:FormGroup;
  constructor(private userlogin:LoginService,private spinner: NgxSpinnerService,private router:Router) {

    this.userdata = this.userlogin.Loadlocal();
    if (this.userdata == null || this.userdata == undefined || this.userdata == [])
    {
      this.router.navigateByUrl("/login");
    }
    this.FormOne = new FormGroup({
      zeroqrcodedata:new FormControl(),
      onefmcode:new FormControl(),
      twotruckreg:new FormControl(),
    });
   }

  ngOnInit(): void {
    this.Loadfarmer21();
    this.LoadTruckdata();
    this.LoadsortQueue();
  }

  OpenBarcodeScan() {
    this.barcodeScanner.start();
  }

  CloseBarcodeScan() {
    this.barcodeScanner.stop();
  }

  onValueChanges(result:any) {
    this.barcodeValue = result.codeResult.code;
    this.barcode = result.codeResult.code;
    this.Loadqonline(this.barcode);

  }

  onStarted(started:any) {
    console.log(started);
  }
  
  // โหลดข้อมูลชาวไร่
  farmerzone21:any;
  Loadfarmer21(){
    axios.get("https://asia-southeast2-brr-farmluck.cloudfunctions.net/dbcps/v_farmer_basic_w?supzone='21'")
    .then(res => {
     this.farmerzone21 = res.data.recordset;
    })
    .catch(err => { throw(err)})
  }

  // โหลดข้อมูลจาก QRCODE
  farqrdata:any;
  Loadqonline(code:any){
    let barcode = this.FormOne.get("zeroqrcodedata")?.value;
    axios.get("https://asia-southeast2-brr-farmluck.cloudfunctions.net/app_farmer/v_Printcard_w?truck_q='"+ barcode +"'")
    .then(res => {
     this.farqrdata = res.data.recordset;
     this.FormOne.get('onefmcode')?.setValue(this.farqrdata[0].fmcode);
     console.log(this.farqrdata);
    })
    .catch(err => { throw(err)})
    this.LoadsortQueue();
  }

  barcode:any;
  onKey(event: any) {
    this.barcode=event.target.value;
  }

   // โหลดข้อมูลรถบันทุก
   truckdata:any;
   LoadTruckdata(){
     let url = "https://asia-southeast2-brr-farmluck.cloudfunctions.net/app_farmer/select_v_Truck_w?f12=1";
     axios.get(url)
     .then(res =>{
      this.truckdata = (res.data.recordset);
     }).catch(err => { throw(err)})
   }


  // แก้ไขคิวอัพเดทคิวอ้อยทางไกล
  UpdateQueue(){
    this.LoadsortQueue();
    let fmcode = (this.FormOne.get('onefmcode')?.value).slice(0,10);
    let regtruck = (this.FormOne.get('twotruckreg')?.value).slice(0,10);
    
    
    if (fmcode =='' || fmcode == undefined || fmcode == null){ alert("กรุณาเลือกชาวไร่ หรือ ระบุโควต้า");}
    else if (regtruck =='' || regtruck == undefined || regtruck == null){ alert("กรุณาเลือกทะเบียนรถ หรือ ระบุทะเบียนรถ");}
    else {
      let url = "https://asia-southeast2-brr-farmluck.cloudfunctions.net/app_farmer/update_qcard_in_q_v4?q_id=" + (this.forwardqrun + 1)
    +"&fmcode=" +  fmcode
    +"&truck_no=" + regtruck
    +"&print_q=2"
    +"&userlogin='" + this.userdata[0].supcode +"'"
    +"&truck_q=" + this.barcode;
    
      console.log(url);
    if(confirm('ต้องการบันทึกรายการ หรือไม่ ?')==true){
      
      axios.post(url).then(res =>{
      if(res.data.rowsAffected[0] == 1){
        this.SendsortQueue(); 
        alert("บันทึกข้อมูลคิวแล้ว");
        $('#showqueue').modal('show');
        this.FormOne.reset();
        this.farqrdata = null;
      }
      else if (res.data.rowsAffected[0] == 0)
      { alert("!!กรุณาลองใหม่ บันทึกรายการไม่สำเร็จ!!"); }
      else if (res.data.code)
      { alert("!!กรุณาลองใหม่ บันทึกรายการไม่สำเร็จ!!") }
      }).catch(err => {throw(err)});
    }
    else {
      alert("ยกเลิกรายการแล้ว");
      this.FormOne.reset();
    }
    }
    
  }



  

  //  โหลดลำดับคิว
  forwardqrun:any;
  LoadsortQueue(){
    axios.get("https://asia-southeast2-brr-farmluck.cloudfunctions.net/app_farmer/select_qonline")
    .then(res =>{
      this.spinner.show();
     let data = res.data.recordset;
     this.forwardqrun = data[0].qf2_run;
     this.spinner.hide();
    }).catch(err => {throw(err)});
  }

  // ส่งลำดับคิว 
  SendsortQueue(){
    let nextque = this.forwardqrun + 1;
    let url = "https://asia-southeast2-brr-farmluck.cloudfunctions.net/app_farmer/update_qonline_w?qf2_run="+nextque+"&timechange=getdate();";
    // console.log(url);
    axios.post(url)
    .then(res =>{
      if(res.data.rowsAffected[0] == 1){
        console.log("q update");
        // this.LoadsortQueue();
      }
      else {
        console.log("q don't update");
      }
    }).catch(err => {throw(err)});
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.farmerzone21 = null;
    this.farqrdata = null;
  }
}



