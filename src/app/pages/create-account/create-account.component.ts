import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl
} from "@angular/forms";
import { CreateAccountService } from "src/app/services/create-account-service.service";
import { Router } from "@angular/router";
import { Notification } from "src/app/app.component";
import { ReCaptchaV3Service } from "ng-recaptcha";
import { Subscription } from "rxjs";
import { ConnectionService } from "src/app/services/connection/connection.service";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "sprint-create-account",
  templateUrl: "./create-account.component.html",
  styleUrls: ["./create-account.component.scss"]
})
export class CreateAccountComponent implements OnInit, OnDestroy {
  public _form: FormGroup;
  private _usernameCtrl: FormControl;
  private _emailCtrl: FormControl;
  private _nameCtrl: FormControl;
  private _firstnameCtrl: FormControl;
  private _businessCtrl: FormControl;
  private _passwordCtrl: FormControl;
  private _newsletter: FormControl;
  private _cgu: FormControl;
  private _subscription: Subscription;
  _show_cgu: boolean = false;
  _loadingPage: boolean = true;
  _passowrd_input: {
    type: "password" | "text";
    icon: "fa-eye" | "fa-eye-slash";
  } = {
    type: "password",
    icon: "fa-eye"
  };
  _form_status: {
    email: { error: boolean; valid: boolean };
    username: { error: boolean; valid: boolean };
    business: { error: boolean; valid: boolean };
    password: { error: boolean; valid: boolean };
    cgu: { error: boolean; valid: boolean };
  } = {
    email: { error: null, valid: null },
    username: { error: null, valid: null },
    business: { error: null, valid: null },
    password: { error: null, valid: null },
    cgu: { error: null, valid: null }
  };
  _error_creation: Notification = {
    show: false,
    message: null
  };
  _loading: boolean = false;

  _pattern_password: string = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})";

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private titleService: Title,
    private recaptchaV3Service: ReCaptchaV3Service,
    private createAccountService: CreateAccountService,
    private connectionService: ConnectionService
  ) {}

  ngOnInit() {
    this.connectionService
      .checkLogged()
      .then(() => (this._loadingPage = false));
    this.titleService.setTitle("RetroSprint Digital - Inscription");
    this._usernameCtrl = this.formBuilder.control("", Validators.required);
    this._emailCtrl = this.formBuilder.control("", [
      Validators.email,
      this.temperalyEmail()
    ]);
    this._nameCtrl = this.formBuilder.control(null);
    this._firstnameCtrl = this.formBuilder.control(null);
    this._businessCtrl = this.formBuilder.control("", Validators.required);
    this._passwordCtrl = this.formBuilder.control("", [
      Validators.required,
      Validators.pattern(new RegExp(this._pattern_password))
    ]);
    this._newsletter = this.formBuilder.control(true);
    this._cgu = this.formBuilder.control(false, [
      Validators.required,
      Validators.requiredTrue
    ]);
    this._form = this.formBuilder.group({
      username: this._usernameCtrl,
      email: this._emailCtrl,
      name: this._nameCtrl,
      firstname: this._firstnameCtrl,
      business: this._businessCtrl,
      password: this._passwordCtrl,
      newsletter: this._newsletter,
      cgu: this._cgu
    });
  }

  temperalyEmail(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      const isTmperalyEmail =
        value.includes("yopmail") ||
        value.includes("qmailshop") ||
        value.includes("mozej") ||
        value.includes("vmani") ||
        value.includes("mozej") ||
        value.includes("enayu") ||
        value.includes("zeroe") ||
        value.includes("tempr") ||
        value.includes("qmailshop");
      return isTmperalyEmail
        ? { temperalyEmail: { value: control.value } }
        : null;
    };
  }

  submit() {
    this.initInvalid();
    if (this._form.invalid) {
      this._loading = false;
      return;
    }
    this._subscription = this.recaptchaV3Service
      .execute("signup")
      .subscribe(_token => {
        this._loading = true;
        this.createAccountService
          .createAccount(this._form)
          .then(() => {
            this.router.navigate(["/connection"], {
              fragment: "created-account"
            });
            this._loading = false;
          })
          .catch(_reason => {
            this._loading = false;
            this._error_creation = {
              show: true,
              message: "Une erreur est survenue veuillez réessayez plus tard"
            };
          });
      });
  }

  initInvalid() {
    if (this._usernameCtrl.status === "INVALID") {
      this._form_status.username.error = true;
      this._form_status.username.valid = false;
    } else if (this._usernameCtrl.status === "VALID") {
      this._form_status.username.error = false;
      this._form_status.username.valid = true;
    }
    if (this._emailCtrl.status === "INVALID") {
      this._form_status.email.error = true;
      this._form_status.email.valid = false;
    } else if (this._emailCtrl.status === "VALID") {
      this._form_status.email.error = false;
      this._form_status.email.valid = true;
    }
    if (this._businessCtrl.status === "INVALID") {
      this._form_status.business.error = true;
      this._form_status.business.valid = false;
    } else if (this._businessCtrl.status === "VALID") {
      this._form_status.business.error = false;
      this._form_status.business.valid = true;
    }
    if (this._passwordCtrl.status === "INVALID") {
      this._form_status.password.error = true;
      this._form_status.password.valid = false;
    } else if (this._passwordCtrl.status === "VALID") {
      this._form_status.password.error = false;
      this._form_status.password.valid = true;
    }
    if (this._cgu.status === "INVALID") {
      this._form_status.cgu.error = true;
      this._form_status.cgu.valid = false;
    } else if (this._cgu.status === "VALID") {
      this._form_status.cgu.error = false;
      this._form_status.cgu.valid = true;
    }
  }

  hideError() {
    this._error_creation = {
      show: false,
      message: null
    };
  }

  showCgu(e) {
    e.preventDefault();
    e.stopPropagation();
    this._show_cgu = true;
  }

  tooglePasswordInput() {
    if (this._passowrd_input.icon === "fa-eye") {
      this._passowrd_input.icon = "fa-eye-slash";
    } else {
      this._passowrd_input.icon = "fa-eye";
    }

    if (this._passowrd_input.type === "password") {
      this._passowrd_input.type = "text";
    } else {
      this._passowrd_input.type = "password";
    }
  }

  public ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
