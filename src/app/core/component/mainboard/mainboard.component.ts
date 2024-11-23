import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';

import { BarcodeScannerLivestreamComponent } from "ngx-barcode-scanner";
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-mainboard',
  templateUrl: './mainboard.component.html',
  styleUrls: ['./mainboard.component.css']
})
export class MainboardComponent implements OnInit {

  @ViewChild(BarcodeScannerLivestreamComponent)
  barcodeScanner: BarcodeScannerLivestreamComponent = new BarcodeScannerLivestreamComponent;
  barcodeValue: any;



  FormOne: FormGroup;
  constructor(private auth: LoginService, private router: Router) {
    let udata = this.auth.Loadlocal();
    if (udata == null || udata == undefined) { this.router.navigateByUrl("/login") }
    this.FormOne = new FormGroup({
      zeroqrcodedata: new FormControl(),
      onefmcode: new FormControl(),
      twotruckreg: new FormControl(),
    });


  }

  ngOnInit(): void {
    this.Loadfarmer21();
  }

  OpenBarcodeScan() {
    this.barcodeScanner.start();
  }

  CloseBarcodeScan() {
    this.barcodeScanner.stop();
  }

  onValueChanges(result: any) {
    this.barcodeValue = result.codeResult.code;
    this.barcode = result.codeResult.code
    this.Loadqonline(this.barcodeValue);
  }

  onStarted(started: any) {
    console.log(started);
  }


  // โหลดข้อมูลชาวไร่
  farmerzone21: any;
  Loadfarmer21() {
    axios.get("https://asia-southeast2-brr-farmluck.cloudfunctions.net/dbcps/v_farmer_basic_w?supzone='21'")
      .then(res => {
        this.farmerzone21 = res.data.recordset;
      })
      .catch(err => { throw (err) })
  }

  // โหลดข้อมูลจาก QRCODE
  farqrdata: any;
  Loadqonline(code: any) {
    let barcode = this.FormOne.get("zeroqrcodedata")?.value;
    axios.get("https://asia-southeast2-brr-farmluck.cloudfunctions.net/app_farmer/v_Printcard_w?truck_q='" + barcode + "'")
      .then(res => {
        this.farqrdata = res.data.recordset;
      })
      .catch(err => { throw (err) })
  }


  barcode: any;
  onKey(event: any) {
    this.barcode = event.target.value;
    this.Loadqonline(this.barcode);
  }


}
