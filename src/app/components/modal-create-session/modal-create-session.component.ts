import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import * as moment from "moment";
import { ProfileService } from "src/app/services/profile/profile.service";
import { CreateSessionService } from "src/app/services/create-session/create-session.service";
import { LUser } from "src/app/models/list-user";
import { Router } from "@angular/router";
import {
  _startstopModel,
  _anchorsenginesModel,
  _starfishModel,
  _defaultModel
} from "src/app/models/models";
import { Theme } from "src/app/models/sprint";

@Component({
  selector: "sprint-modal-create-session",
  templateUrl: "./modal-create-session.component.html",
  styleUrls: ["./modal-create-session.component.scss"]
})
export class ModalCreateSessionComponent implements OnInit {
  @Output() hideModal: EventEmitter<boolean> = new EventEmitter();
  public _form: FormGroup;
  private _nameCtrl: FormControl;
  _enableLast: boolean = false;
  _users_find: LUser[] = [];
  _users_added: LUser[] = [];
  _loading: boolean = false;
  _form_status: {
    name: { error: boolean; valid: boolean };
  } = {
    name: { error: null, valid: null }
  };

  _modelSelections:
    | "default"
    | "last"
    | "startstopend"
    | "anchorsengines"
    | "starfish" = "default";
  _modelSelected: Theme[] = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private profileService: ProfileService,
    private createSessionService: CreateSessionService
  ) {}

  ngOnInit() {
    const { user } = this.profileService;
    if (user.sprints) {
      this._enableLast = true;
      this._modelSelections = "last";
    }
    this._nameCtrl = this.formBuilder.control(
      user.business
        ? `Rétrospective Sprint du ${moment().format("DD/MM/YYYY")} - ${
            user.business
          }`
        : `Rétrospective Sprint du ${moment().format("DD/MM/YYYY")} - ${
            user.username
          }`,
      Validators.required
    );
    this._form = this.formBuilder.group({
      name: this._nameCtrl
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
      value: { name }
    } = this._form;
    this.createSessionService
      .createSprint(name, this._users_added, this._modelSelected)
      .then(sprint => {
        this._loading = false;
        this.router.navigate([`/sessions/${sprint.id}`]);
      })
      .catch(() => {
        this._loading = false;
      });
  }

  initInvalid() {
    if (this._nameCtrl.status === "INVALID") {
      this._form_status.name.error = true;
      this._form_status.name.valid = false;
    } else if (this._nameCtrl.status === "VALID") {
      this._form_status.name.error = false;
      this._form_status.name.valid = true;
    }
  }

  selectModel(
    model: "default" | "last" | "startstopend" | "anchorsengines" | "starfish"
  ) {
    switch (model) {
      case "last":
        if (!this._enableLast) return;
        this._modelSelected = null;
        break;
      case "default":
        this._modelSelected = _defaultModel;
        break;
      case "starfish":
        this._modelSelected = _starfishModel;
        break;
      case "anchorsengines":
        this._modelSelected = _anchorsenginesModel;
        break;
      case "startstopend":
        this._modelSelected = _startstopModel;
    }
    if (model === "last" && !this._enableLast) {
      return;
    }
    this._modelSelections = model;
  }

  hide() {
    this.hideModal.emit(true);
  }
}
