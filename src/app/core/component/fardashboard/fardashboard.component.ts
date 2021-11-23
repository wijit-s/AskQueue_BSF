import { LoginService } from './../../service/login.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import axios from 'axios';
import { BarcodeScannerLivestreamComponent } from 'ngx-barcode-scanner';

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
  constructor(private userlogin:LoginService) {
    this.userdata = this.userlogin.Loadlocal();
    this.FormOne = new FormGroup({
      zeroqrcodedata:new FormControl(),
      onefmcode:new FormControl(),
      twotruckreg:new FormControl(),
    });
   }

  ngOnInit(): void {
    this.Loadfarmer21();
    this.LoadTruckdata();
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
    // let code = this.FormOne.get("zeroqrcodedata")?.value;
    axios.get("https://asia-southeast2-brr-farmluck.cloudfunctions.net/app_farmer/v_Printcard_w?truck_q='"+ code +"'")
    .then(res => {
     this.farqrdata = res.data.recordset;
    })
    .catch(err => { throw(err)})
  }

  barcode:any;
  onKey(event: any) {
    this.barcode=event.target.value;
  }

  // แก้ไขคิว
  UpdateQueue(){
    let url = "https://asia-southeast2-brr-farmluck.cloudfunctions.net/app_farmer/update_qcard_in_q_v4?q_id=1"
    +"&fmcode=0064000345"
    +"&truck_no=1111100013"
    +"&print_q=2"
    +"&userlogin='" + this.userdata[0].supcode +"'"
    +"&truck_q=" + this.barcode;
    axios.post(url).then(res =>{
      if(res.data.rowAffected[0] == 1){
        alert("บันทึกข้อมูลคิวแล้ว");
      }
      else { alert("!!กรุณาลองใหม่ บันทึกรายการไม่สำเร็จ!!") }
    }).catch(err => {throw(err)});
  }

  // โหลดข้อมูลทะเบียนรถอ้อยทางไกล
  fartruckdata:any;
  LoadTruckFarAway(){

  }

   // โหลดข้อมูลรถบันทุก
   truckdata:any;
   LoadTruckdata(){
     let url = "https://asia-southeast2-brr-farmluck.cloudfunctions.net/app_farmer/select_v_Truck_w?f12=1";
     axios.get(url)
     .then(res =>{
      this.truckdata = (res.data.recordset);
      //  console.log(data); .filter((el:any) => el.SUPZONE == 21 || el.SUPZONE == 22 || el.SUPZONE == 23)
     }).catch(err => { throw(err)})
   }

  //  โหลดลำดับคิว
  forwardqrun:any;
  LoadsortQueue(){
    axios.get("https://asia-southeast2-brr-farmluck.cloudfunctions.net/app_farmer/select_qonline")
    .then(res =>{
     let data = res.data.recordset;
     this.forwardqrun = data[0].qf2_run;
    }).catch(err => {throw(err)});
  }

  // ส่งลำดับคิว 
  SendsortQueue(){
    let nextque = this.forwardqrun + 1;
    let url = "https://asia-southeast2-brr-farmluck.cloudfunctions.net/app_farmer/update_qonline_w?qf2_run="+nextque+"&timechange=getdate()";
    axios.post(url)
    .then(res =>{
      if(res.data.rowsAffected[0] == 1){
        console.log("q update");
      }
      else {
        console.log("q don't update");
      }
    }).catch(err => {throw(err)});
  }
}

