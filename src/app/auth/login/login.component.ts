import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/core/services/api.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: UntypedFormGroup;
  fieldTextType!: boolean;
  submitted = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private _http: ApiService,
    private toastr: ToastrService,
    private loader: NgxSpinnerService,
    private jwtService: TokenStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }


  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }


  onSubmit() {
    this.submitted = true;

    if (this.loginForm.valid) {
      this.loader.show();
      let payload = this.loginForm.value;
      this._http.makePostRequest("login", payload)
        .then((result: any) => {
          if (!result.error) {
            this.toastr.success(result.msg ? result.msg : "User registered successfully.");
            this.jwtService.saveToken(result.token);
            this.jwtService.saveUser(result.data);
            this.router.navigate(['/']);
          }
          else {
            this.toastr.error(result.msg ? result.msg : "Failed to register user");
          }
          this.loader.hide();
        });
    }
  }
}
