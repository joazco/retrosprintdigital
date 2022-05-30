import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { Sprint, Theme } from "src/app/models/sprint";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { InfoService } from "src/app/services/info/info.service";
import { ProfileService } from "src/app/services/profile/profile.service";
import { ModalEdit } from "src/app/pages/sessions/session/session.component";

@Component({
  selector: "sprint-modal-append-info",
  templateUrl: "./modal-append-info.component.html",
  styleUrls: ["./modal-append-info.component.scss"]
})
export class ModalAppendInfoComponent implements OnInit {
  @Input() sprint: Sprint = null;
  @Input() themes: Theme[] = [];
  @Input() edit: ModalEdit = null;
  @Input() themeSelected: Theme = null;
  @Output() hideModal: EventEmitter<boolean> = new EventEmitter();

  public _form: FormGroup;
  private _themeCtrl: FormControl;
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
    private profileService: ProfileService,
    private infoService: InfoService
  ) {}

  ngOnInit() {
    this._themeCtrl = this.formBuilder.control(
      this.edit
        ? this.edit.info.theme
        : this.themeSelected
        ? this.themeSelected.id
        : "",
      Validators.required
    );
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

    const themeType = this.themes.find(
      themeInList => themeInList.id === (theme as number)
    )
      ? this.themes.find(themeInList => themeInList.id === (theme as number))
          .type
      : "is-valid";

    this._loading = true;
    const { user } = this.profileService;
    if (this.edit) {
      this.infoService
        .editInfo(user.uid, this.sprint.id, this.edit.info.id, {
          content,
          theme,
          themeType
        })
        .then(() => this.hideModal.emit(true))
        .catch(() => this.hideModal.emit(true));
    } else {
      this.infoService
        .appendInfo(user.uid, this.sprint.id, {
          content,
          theme,
          themeType
        })
        .then(() => this.hideModal.emit(true))
        .catch(() => this.hideModal.emit(true));
    }
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
}
