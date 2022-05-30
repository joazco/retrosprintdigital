import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { ConnectionService } from "src/app/services/connection/connection.service";
import { Router } from "@angular/router";

@Component({
  selector: "sprint-forget-password",
  templateUrl: "./forget-password.component.html",
  styleUrls: ["./forget-password.component.scss"]
})
export class ForgetPasswordComponent implements OnInit {
  public _form: FormGroup;
  private _emailCtrl: FormControl;
  _form_status: {
    email: { error: boolean; valid: boolean };
  } = {
    email: { error: null, valid: null }
  };

  _loading: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private connectionService: ConnectionService
  ) {}

  ngOnInit() {
    this._emailCtrl = this.formBuilder.control("", Validators.email);
    this._form = this.formBuilder.group({
      email: this._emailCtrl
    });
  }

  submit() {
    this.initInvalid();
    if (this._form.status === "INVALID") {
      return;
    }
    this._loading = true;
    const {
      value: { email }
    } = this._form;
    this.connectionService
      .sendResetPassword(email)
      .then(() => this.redirectConnectionPage())
      .catch(() => this.redirectConnectionPage());
  }

  initInvalid() {
    if (this._emailCtrl.status === "INVALID") {
      this._form_status.email.error = true;
      this._form_status.email.valid = false;
    }
  }

  redirectConnectionPage() {
    this._loading = false;
    this.router.navigate(["/connection"], { fragment: "reset-password" });
  }
}
