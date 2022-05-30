import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnDestroy
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { ProfileService } from "src/app/services/profile/profile.service";

@Component({
  selector: "sprint-modal-edit-profil",
  templateUrl: "./modal-edit-profil.component.html",
  styleUrls: ["./modal-edit-profil.component.scss"]
})
export class ModalEditProfilComponent implements OnInit, OnDestroy {
  @Input() disableCancel: boolean = false;
  @Output() hideModal: EventEmitter<boolean> = new EventEmitter();

  public _form: FormGroup;
  private _usernameCtrl: FormControl;
  private _emailCtrl: FormControl;
  private _nameCtrl: FormControl;
  private _firstnameCtrl: FormControl;
  private _businessCtrl: FormControl;
  private _newsletter: FormControl;
  private _cgu: FormControl;
  _show_cgu: boolean = false;
  _loading: boolean = false;
  _form_status: {
    email: { error: boolean; valid: boolean };
    business: { error: boolean; valid: boolean };
    username: { error: boolean; valid: boolean };
    cgu: { error: boolean; valid: boolean };
  } = {
    email: { error: null, valid: null },
    business: { error: null, valid: null },
    username: { error: null, valid: null },
    cgu: { error: null, valid: null }
  };
  _error_edit: { show: boolean; message: string } = {
    show: false,
    message: "Une erreur est survenue"
  };
  constructor(
    private formBuilder: FormBuilder,
    public profileService: ProfileService
  ) {}

  ngOnInit() {
    const { user } = this.profileService;
    this._usernameCtrl = this.formBuilder.control(
      user.username,
      Validators.required
    );
    this._emailCtrl = this.formBuilder.control(
      { value: user.email, disabled: true },
      Validators.email
    );
    this._nameCtrl = this.formBuilder.control(user.name);
    this._firstnameCtrl = this.formBuilder.control(user.firstname);
    this._businessCtrl = this.formBuilder.control(
      user.business ? user.business : "",
      Validators.required
    );
    this._newsletter = this.formBuilder.control(user.newsletter);
    this._cgu = this.formBuilder.control(user.cgu, [
      Validators.required,
      Validators.requiredTrue
    ]);
    this._form = this.formBuilder.group({
      username: this._usernameCtrl,
      email: this._emailCtrl,
      name: this._nameCtrl,
      firstname: this._firstnameCtrl,
      business: this._businessCtrl,
      newsletter: this._newsletter,
      cgu: this._cgu
    });
  }

  ngOnDestroy() {
    this._show_cgu = false;
  }

  submit() {
    this.initInvalid();
    if (this._form.invalid) {
      this._loading = false;
      return;
    }
    this._loading = true;
    this.profileService
      .updateCurrentUser(this._form)
      .then(() => this.hide())
      .catch(() => {
        this._error_edit.show = true;
        this._loading = false;
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
    if (this._businessCtrl.status === "INVALID") {
      this._form_status.business.error = true;
      this._form_status.business.valid = false;
    } else if (this._businessCtrl.status === "VALID") {
      this._form_status.business.error = false;
      this._form_status.business.valid = true;
    }
    if (this._emailCtrl.status === "INVALID") {
      this._form_status.email.error = true;
      this._form_status.email.valid = false;
    } else if (this._emailCtrl.status === "VALID") {
      this._form_status.email.error = false;
      this._form_status.email.valid = true;
    }
    if (this._cgu.status === "INVALID") {
      this._form_status.cgu.error = true;
      this._form_status.cgu.valid = false;
    } else if (this._cgu.status === "VALID") {
      this._form_status.cgu.error = false;
      this._form_status.cgu.valid = true;
    }
  }

  showCgu(e) {
    e.preventDefault();
    e.stopPropagation();
    this._show_cgu = true;
  }

  hide() {
    this.hideModal.emit(true);
  }
}
