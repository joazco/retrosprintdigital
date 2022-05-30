import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";
import { Sprint } from "src/app/models/sprint";
import { ModalEdit } from "src/app/pages/sessions/session/session.component";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { SessionService } from "src/app/services/session/session.service";

@Component({
  selector: "sprint-modal-append-column",
  templateUrl: "./modal-append-column.component.html",
  styleUrls: ["./modal-append-column.component.scss"]
})
export class ModalAppendColumnComponent implements OnInit {
  @Input() sprint: Sprint = null;

  @Input() edit: ModalEdit = null;
  @Output() hideModal: EventEmitter<boolean> = new EventEmitter();
  themes: {
    id: string;
    title: string;
    background: "#2980b9" | "#ff6663" | "#f6bd60" | "#2ed573";
  }[] = [
    {
      id: "is-success",
      title: "Learned",
      background: "#2980b9"
    },
    {
      id: "is-valid",
      title: "Liked",
      background: "#2ed573"
    },

    {
      id: "is-warning",
      title: "Lacked",
      background: "#f6bd60"
    },

    {
      id: "is-danger",
      title: "Longed for",
      background: "#ff6663"
    }
  ];

  public _form: FormGroup;
  public _themeCtrl: FormControl;
  private _contentCtrl: FormControl;
  _loading: boolean = false;
  _form_status: {
    theme: { error: boolean; valid: boolean };
    content: { error: boolean; valid: boolean };
  } = {
    theme: { error: null, valid: null },
    content: { error: null, valid: null }
  };

  constructor(
    private formBuilder: FormBuilder,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this._themeCtrl = this.formBuilder.control("", Validators.required);
    this._contentCtrl = this.formBuilder.control(
      this.edit ? this.edit.info.content : "",
      Validators.required
    );
    this._form = this.formBuilder.group({
      theme: this._themeCtrl,
      content: this._contentCtrl
    });
  }

  keyEnterSubmit(event: KeyboardEvent) {
    const { metaKey, ctrlKey, key } = event;
    if ((metaKey && key === "Enter") || (ctrlKey && key === "Enter")) {
      event.preventDefault();
      event.stopPropagation();
      this.submit();
    }
  }

  submit() {
    this.initInvalid();
    if (this._form.invalid) {
      this._loading = false;
      return;
    }

    const {
      value: { theme, content }
    } = this._form;

    this.sessionService
      .appendTheme(this.sprint, {
        type: theme,
        title: content
      })
      .then(() => this.hideModal.emit(true))
      .catch(() => this.hideModal.emit(true));
  }

  initInvalid() {
    if (this._themeCtrl.status === "INVALID") {
      this._form_status.theme.error = true;
      this._form_status.theme.valid = false;
    } else if (this._themeCtrl.status === "VALID") {
      this._form_status.theme.error = false;
      this._form_status.theme.valid = true;
    }
    if (this._contentCtrl.status === "INVALID") {
      this._form_status.content.error = true;
      this._form_status.content.valid = false;
    } else if (this._contentCtrl.status === "VALID") {
      this._form_status.content.error = false;
      this._form_status.content.valid = true;
    }
  }

  selectCategorie(id: string) {
    this._themeCtrl.setValue(id);
  }
}
