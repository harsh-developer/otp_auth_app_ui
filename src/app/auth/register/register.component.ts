import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent {
  signupForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;


  constructor(
    private formBuilder: UntypedFormBuilder,
    private _http: ApiService,
    private toastr: ToastrService,
    private loader: NgxSpinnerService
  ) { }


  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }


  get f() {
    return this.signupForm.controls;
  }


  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }


  onSubmit() {
    this.submitted = true;
    if (this.signupForm.valid) {
      this.loader.show();
      let payload = this.signupForm.value;
      this._http.makePostRequest("register", payload)
        .then((result: any) => {
          if (!result.error) {
            this.toastr.success(result.msg ? result.msg : "User registered successfully.");
          }
          else {
            this.toastr.error(result.msg ? result.msg : "Failed to register user");
          }
          this.loader.hide();
        });
    }

  }
}
