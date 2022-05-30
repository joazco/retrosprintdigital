import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { Notification } from "src/app/app.component";
import { ProfileService } from "src/app/services/profile/profile.service";

@Component({
  selector: "sprint-modal-edit-password",
  templateUrl: "./modal-edit-password.component.html",
  styleUrls: ["./modal-edit-password.component.scss"]
})
export class ModalEditPasswordComponent implements OnInit {
  @Output() hideModal: EventEmitter<boolean> = new EventEmitter();

  public _form: FormGroup;
  private _passwordCtrl: FormControl;
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
    password: { error: boolean; valid: boolean };
  } = {
    email: { error: null, valid: null },
    username: { error: null, valid: null },
    password: { error: null, valid: null }
  };
  _error_edit: { show: boolean; message: string } = {
    show: false,
    message: "Une erreur est survenue"
  };
  _loading: boolean = false;

  _pattern_password: string = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})";

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this._passwordCtrl = this.formBuilder.control("", [
      Validators.required,
      Validators.pattern(new RegExp(this._pattern_password))
    ]);
    this._form = this.formBuilder.group({
      password: this._passwordCtrl
    });
  }

  submit() {
    this.initInvalid();
    if (this._form.invalid) {
      this._loading = false;
      return;
    }
    this._loading = true;
    this.profileService
      .updatePasswordCurrentUser(this._form)
      .then(() => this.hide())
      .catch(() => {
        this._error_edit.show = true;
        this._loading = false;
      });
  }

  initInvalid() {
    if (this._passwordCtrl.status === "INVALID") {
      this._form_status.password.error = true;
      this._form_status.password.valid = false;
    } else if (this._passwordCtrl.status === "VALID") {
      this._form_status.password.error = false;
      this._form_status.password.valid = true;
    }
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

  hide() {
    this.hideModal.emit(true);
  }
}
