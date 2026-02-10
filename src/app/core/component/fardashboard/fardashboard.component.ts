import { LoginService } from './../../service/login.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import axios from 'axios';
import { BarcodeScannerLivestreamComponent } from 'ngx-barcode-scanner';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CanclequeueComponent } from '../canclequeue/canclequeue.component';

declare var $: any;
@Component({
  selector: 'app-fardashboard',
  templateUrl: './fardashboard.component.html',
  styleUrls: ['./fardashboard.component.css']
})
export class FardashboardComponent implements OnInit {

  @ViewChild(BarcodeScannerLivestreamComponent)
  barcodeScanner: BarcodeScannerLivestreamComponent = new BarcodeScannerLivestreamComponent;
  barcodeValue: any;

  @ViewChild('canclequeue', { static: false }) Cancleq?: CanclequeueComponent;

  barcode_type = "code_128"
  userdata: any[];
  FormOne: FormGroup;
  constructor(private userlogin: LoginService, private spinner: NgxSpinnerService, private router: Router) {

    this.userdata = this.userlogin.Loadlocal();
    console.log(this.userdata)
    if (this.userdata.length == 0) {
      this.router.navigateByUrl("/login");
    }
    this.FormOne = new FormGroup({
      zeroqrcodedata: new FormControl('', [Validators.required, Validators.minLength(10)]),
      onefmcode: new FormControl('', [Validators.required]),
      twotruckreg: new FormControl('', [Validators.required]),
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

  onValueChanges(result: any) {
    this.barcodeValue = result.codeResult.code;
    this.barcode = result.codeResult.code;
    this.Loadqonline(this.barcode);

  }
  data_s = { truck_q: '', farmer_id: 0, truckbrr_id: 0 }

  onStarted(started: any) {
    console.log(started);
  }
  h_url = 'https://asia-southeast2-brr-farmluck.cloudfunctions.net';
  // โหลดข้อมูลชาวไร่
  farmerzone21: any[] = [];
  Loadfarmer21() {
    let url = ''
    url = `${this.h_url}/dbcps/select_s_f_w_0?s=[fmcode_b1],[fmcode],[fmname],[SUPZONE],[farmer_id]&f=CPS6263.dbo.v_farmer_basic&w=supzone in('21','22','23') order by fmcode_b1`;
    axios.get(url)
      .then(res => {
        let data = res.data;
        this.farmerzone21 = data;
      })
      .catch(err => { throw (err) })
  }

  // เมื่อเลือกชาวไร่จาก datalist ให้เก็บ farmer_id ลงใน data_s.farmer_id
  onSelect(type: number) {
    if (type === 2) {
      const selected = this.FormOne.get('onefmcode')?.value;
      if (!selected) {
        this.data_s.farmer_id = 0;
        return;
      }
      // ค้นหาใน farmerzone21 โดยเปรียบเทียบกับ fmcode_b1
      const found = this.farmerzone21.find(item => item.fmcode_b1 === selected || item.fmcode === selected);
      if (found && found.farmer_id !== undefined) {
        this.data_s.farmer_id = found.farmer_id;
      } else {
        // หากไม่พบ ให้เป็น 0 (หรือจะเก็บเป็น null ตามต้องการ)
        this.data_s.farmer_id = 0;
      }
    }
    else if (type === 3) {
      const selectedTruck = this.FormOne.get('twotruckreg')?.value;
      if (!selectedTruck) {
        this.data_s.truckbrr_id = 0;
        return;
      }
      const foundTruck = this.truckdata.find(item => (item.TRUCK_NO) === selectedTruck || (item.REGTRUCK) === selectedTruck);
      if (foundTruck && foundTruck.truckbrr_id !== undefined) {
        this.data_s.truckbrr_id = foundTruck.truckbrr_id;
      } else {
        this.data_s.truckbrr_id = 0;
      }
    }
    console.log('Selected_id:', this.data_s);
  }

  // โหลดข้อมูลจาก QRCODE
  farqrdata: any;
  checkprintQue: any;
  Loadqonline(code: any) {
    let barcode = this.FormOne.get("zeroqrcodedata")?.value;
    let url = `${this.h_url}/dbcps/select_s_f_w_0?s=*&f=[dbQBRD].[dbo].[v_Printcard]&w=truck_q='${barcode}'`
    axios.get(url)
      .then(res => {
        let data = res.data[0];
        //this.farqrdata = res.data.recordset;
        this.FormOne.get('onefmcode')?.setValue(data.fmcode || '');
        let ckp = this.checkprintQue = data.print_q;
        if (parseInt(ckp) != 0) {
          alert("!!ใบคิว " + data.truck_q + " ถูกใช้ไปแล้ว ไม่สามารถใช้คิวซ้ำได้!!");
          this.barcode = '';
          this.farqrdata = '';
          this.FormOne.reset();
        }
        else {
          this.onSelect(2);
          this.data_s.farmer_id = data.farmer_id;
          this.data_s.truck_q = data.truck_q;
        }
        console.log('v_Printcard:', data);
      })
      .catch(err => { throw (err) })
    this.LoadsortQueue();
  }

  barcode: string = '';
  onKey(event: any) {
    this.barcode = event.target.value;
  }

  // โหลดข้อมูลรถบันทุก
  truckdata: any[] = [];
  LoadTruckdata() {
    //let url = `${this.h_url}/app_farmer/select_v_Truck_w?f12=1`;
    let url = `${this.h_url}/dbcps/select_s_f_w_0?s=*&f=[dbQBRD].[dbo].[v_Truck]&w=f12=1`;
    axios.get(url)
      .then(res => {
        this.truckdata = (res.data);
      }).catch(err => { throw (err) })
  }

  // แก้ไขคิวอัพเดทคิวอ้อยทางไกล
  UpdateQueue() {
    this.LoadsortQueue();
    let data_s = this.data_s;

    //let fmcode = (this.FormOne.get('onefmcode')?.value);
    //let regtruck = (this.FormOne.get('twotruckreg')?.value).slice(0, 10);
    //let relength = regtruck.length;
    //let ckregtruck = (this.FormOne.get('twotruckreg')?.value).slice(0, 4);
    if (data_s.truck_q.length < 10) { alert("!!กรุณาแสกน บาร์โคด 10 หลัก ที่ใช้ได้ ที่ขึ้นต้น ด้วย 71,72,73,74,75!!"); return }
    if (this.checkprintQue != 0) { alert("!!คิวถูกแจ้งไปแล้ว ไม่สามารถใช้คิวซ้ำได้!!"); return }
    if (data_s.farmer_id == 0) { alert("กรุณาเลือกชาวไร่ หรือ ระบุโควตา"); return }
    if (data_s.truckbrr_id == 0) { alert("กรุณาเลือกรหัสรถบรรทุก 10 หลัก ตามด้วยทะเบียน"); return }
    //else if (regtruck.trim() == '' || regtruck.trim() == undefined || regtruck.trim() == null) { alert("กรุณาเลือกทะเบียนรถ หรือ ระบุทะเบียนรถ"); }

    console.log('forwardqrun:', this.forwardqrun);
    //fmcode = fmcode.slice(0, 10);
    let url = `${this.h_url}/app_farmer/update_qcard_in_q_v4?q_id=` + (this.forwardqrun + 1)
      + "&farmer_id=" + data_s.farmer_id
      + "&truckbrr_id=" + data_s.truckbrr_id
      + "&print_q=1"
      + "&userlogin='" + this.userdata[0].supcode + "'"
      + "&truck_q=" + this.barcode;

    //console.log(url);
    if (confirm('ต้องการบันทึกรายการ หรือไม่ ?') == true) {
      axios.post(url).then(res => {
        if (res.data.rowsAffected[0] == 1) {
          alert("บันทึกข้อมูลคิวแล้ว");
          this.SendsortQueue();
          $('#showqueue').modal('show');
          this.FormOne.reset();
          this.farqrdata = null;
          this.Cancleq?.LoadqueList();
        }
        else if (res.data.rowsAffected[0] == 0) { alert("!!กรุณาลองใหม่ บันทึกรายการไม่สำเร็จ!!"); }
        else if (res.data.code) { alert("!!กรุณาลองใหม่ บันทึกรายการไม่สำเร็จ!!") }
      }).catch(err => { throw (err) });
    }
    else {
      alert("ยกเลิกรายการแล้ว");
      this.FormOne.reset();
    }
  }



  //  โหลดลำดับคิว
  forwardqrun: number = 0;
  LoadsortQueue() {
    this.spinner.show();
    axios.get(`${this.h_url}/app_farmer/select_qonline`)
      .then(res => {
        let data = res.data.recordset;
        this.forwardqrun = data[0].qf2_run;
        this.spinner.hide();
      }).catch(err => { throw (err) });
  }

  // ส่งลำดับคิว 
  SendsortQueue() {
    let nextque = this.forwardqrun + 1;
    let url = `${this.h_url}/app_farmer/update_qonline_w?qf2_run=` + nextque + "&timechange=getdate();";
    // console.log(url);
    axios.post(url)
      .then(res => {
        if (res.data.rowsAffected[0] == 1) {
          console.log("q update");
        }
        else {
          console.log("q don't update");
        }
      }).catch(err => { throw (err) });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.farmerzone21 = [];
    this.farqrdata = null;
  }
}



