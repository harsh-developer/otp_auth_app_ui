import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent {
  otpForm!: UntypedFormGroup;
  public userList: any;
  public selectedUserDetails: any = {};
  public recaptchaContainer = "recaptcha-container";
  public isSubmitted: boolean = false;
  public expiryFlag: boolean = false;

  // for showing countdown
  countdown: number = 120; // 2 minutes (in seconds)
  interval: any;
  isTimerRunning: boolean = false;


  constructor(
    private formBuilder: UntypedFormBuilder,
    private _http: ApiService,
    private toastr: ToastrService,
    private loader: NgxSpinnerService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.getUserList();
    this.otpForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  get f() {
    return this.otpForm.controls;
  }


  getUserList() {
    this.loader.show();
    this._http.makePostRequest("getUserList", {})
      .then((result: any) => {
        if (!result.error) {
          this.userList = result.data ? result.data : [];
        }
        else {
          this.toastr.error(result.msg ? result.msg : "Failed to load user list");
        }
        this.loader.hide();
      })
  }


  openVerificationModal(content: any, index: any) {
    this.modalService.open(content);
    this.selectedUserDetails['phone'] = this.userList[index]['phone'];
    this.selectedUserDetails['isOtpSent'] = false;
  }


  sendOtp() {
    this.startTimer();
    this.selectedUserDetails['isOtpSent'] = true;
    this.loader.show();
    let payload = { phone: this.selectedUserDetails['phone'] };
    this._http.makePostRequest("sendOtp", payload)
      .then((result: any) => {
        if (!result.error) {
          this.toastr.success(result.msg ? result.msg : `OTP has been sent successfully to ${this.selectedUserDetails['phone']}`)
        }
        else {
          if (result.flag && result.flag == 'EXPIRE') {
            this.expiryFlag = true;
          }
          this.toastr.error(result.msg ? result.msg : "Failed to sent OTP");
        }
        this.loader.hide();
      })
  }


  submitOtp() {
    this.isSubmitted = true;
    if (this.otpForm.valid) {
      this.loader.show();
      let payload = { phone: this.selectedUserDetails['phone'], ...this.otpForm.value };
      this._http.makePostRequest('verifyOtp', payload)
        .then((result: any) => {
          if (!result.error) {
            this.toastr.success(result.msg ? result.msg : "Phone verified successfully");
            this.modalService.dismissAll();
          }
          else {
            this.toastr.error(result.msg ? result.msg : "Failed to verify phone");
          }
          this.loader.hide();

          // calling the list API again to fetch updated data
          this.getUserList();
        })
    }
  }

  startTimer() {
    if (this.interval) {
      clearInterval(this.interval); // reset timer if already running
    }

    this.countdown = 120; // reset to 2 minutes
    this.isTimerRunning = true;

    this.interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.interval);
        this.isTimerRunning = false; // enable button when timer ends
      }
    }, 1000);
  }


  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const secs: number = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
}
