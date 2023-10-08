import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  deleteSuccessMsg:string='';//delete success message
  deleteConfirmStatus:boolean=false;//delete confirm content
  acno: any;//for parent to child data communication
  logoutSuccess: boolean = false;//for logout
  transferSuccess: string = '';//success message
  transferError: string = '';//error message
  balance: String = ''//to hold the current balance
  user: string = ''//to hold the current user name
  currentAcno: string = ''//to hold the current Acno
  constructor(private fb: FormBuilder, private api: ApiService, private logoutRouter: Router) {

  }
  ngOnInit(): void {


  if(!localStorage.getItem("token")){
    alert("Please login")
    this.logoutRouter.navigateByUrl('')
  }
    if (localStorage.getItem('currentUser')) {
      this.user = localStorage.getItem('currentUser') || '';//currentuser
    }
    // if (localStorage.getItem('balance')) {
    //   this.balance = localStorage.getItem('balance') || '';//currentbalance
    // }
    if (localStorage.getItem('currentAcno')) {
      this.currentAcno = localStorage.getItem('currentAcno') || '';//currentAcno
    }
  }
  //create a formGroup and array
  fundTransferForm = this.fb.group({//formGroup
    creditacno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    amount: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    password: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]],
  })

  isCollapse: boolean = false
  collapse() {
    this.isCollapse = !this.isCollapse
  }
  //control passes through html page
  //fund transfer
  dashboardForm() {
    if (this.fundTransferForm.valid) {
      let creditAcno = this.fundTransferForm.value.creditacno;
      let password = this.fundTransferForm.value.password;
      let amount = this.fundTransferForm.value.amount;
      this.api.fundTransfer(creditAcno, password, amount).subscribe((result: any) => {
        console.log(result);
        this.transferSuccess = result.message
        setTimeout(() => {
          this.transferSuccess = ''
          this.fundTransferForm.reset()
        }, 3000)
      },
        (result: any) => {
          console.log((result.error.message));
          this.transferError = result.error.message
          setTimeout(() => {
            this.transferError = ''
            this.fundTransferForm.reset()
          }, 3000)
        })

      //alert('Form clicked')
    }
    else {
      alert("Please enter valid parameters")
    }
  }
  getBalance() {
    this.api.getBalance(this.currentAcno).subscribe((result: any) => {
      this.balance = result.balance
    },
      (result: any) => {
        alert(result.error.message)
      })
  }
  reset() {
    this.fundTransferForm.reset();
  }
  logout() {
    this.logoutSuccess = true
    setTimeout(() => {
      this.logoutRouter.navigateByUrl('')
      localStorage.clear()
    }, 3000)
  }

  deleteAccount() {
    //data to be shared with the child
    this.acno = localStorage.getItem('currentAcno')//1
    this.deleteConfirmStatus=true
    
  }
  cancelDeleteConfirm(){
    this.acno=''
    this.deleteConfirmStatus=false
  }
  deleteFromParent(){
    this.api.deleteAccount().subscribe((result:any)=>{
      localStorage.clear()//remove all the accounts details from the local storage
      this.deleteSuccessMsg=result.message//Account delete successfully
      setTimeout(()=>{
        this.logoutRouter.navigateByUrl('')//redirect back to login page
      },3000)

    })
  }

}
