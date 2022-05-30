import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Theme, Sprint } from "src/app/models/sprint";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { SessionService } from "src/app/services/session/session.service";

@Component({
  selector: "sprint-modal-minus-column",
  templateUrl: "./modal-minus-column.component.html",
  styleUrls: ["./modal-minus-column.component.scss"]
})
export class ModalMinusColumnComponent implements OnInit {
  @Input() sprint: Sprint = null;
  @Input() themes: Theme[] = [];
  @Output() hideModal: EventEmitter<boolean> = new EventEmitter();

  public _form: FormGroup;
  private _themeCtrl: FormControl;

  _loading: boolean = false;
  _form_status: {
    theme: { error: boolean; valid: boolean };
  } = {
    theme: { error: null, valid: null }
  };

  constructor(
    private formBuilder: FormBuilder,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this._themeCtrl = this.formBuilder.control("", Validators.required);
    this._form = this.formBuilder.group({
      theme: this._themeCtrl
    });
  }

  submit() {
    this.initInvalid();
    if (this._form.invalid) {
      this._loading = false;
      return;
    }
    this._loading = true;
    const {
      value: { theme }
    } = this._form;
    this.sessionService
      .removeTheme(this.sprint, theme)
      .then(() => {
        this._loading = false;
        this.hideModal.emit(true);
      })
      .catch(() => (this._loading = false));
  }

  initInvalid() {
    if (this._themeCtrl.status === "INVALID") {
      this._form_status.theme.error = true;
      this._form_status.theme.valid = false;
    } else if (this._themeCtrl.status === "VALID") {
      this._form_status.theme.error = false;
      this._form_status.theme.valid = true;
    }
  }
}
