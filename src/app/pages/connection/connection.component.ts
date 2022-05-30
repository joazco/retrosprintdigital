import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup
} from "@angular/forms";
import { Notification } from "src/app/app.component";
import { ConnectionService } from "src/app/services/connection/connection.service";
import { ReCaptchaV3Service } from "ng-recaptcha";
import { Subscription } from "rxjs";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "sprint-connection",
  templateUrl: "./connection.component.html",
  styleUrls: ["./connection.component.scss"]
})
export class ConnectionComponent implements OnInit {
  public _form: FormGroup;
  private _emailCtrl: FormControl;
  private _passwordCtrl: FormControl;
  private _subscription: Subscription;
  _loadingPage: boolean = true;
  _form_status: {
    email: { error: boolean; valid: boolean };
    password: { error: boolean; valid: boolean };
  } = {
    email: { error: null, valid: null },
    password: { error: null, valid: null }
  };

  /** Notifications */
  _success_message: Notification = {
    show: false,
    message:
      "Votre compte a bien été créé, un email de confirmation vous a été envoyé."
  };
  _success_reset_password_message: Notification = {
    show: false,
    message:
      "Vous avez bien réinitialisé votre mot de passe, un mail vous a été envoyé."
  };
  _email_unverified_message: Notification = {
    show: false,
    message: ""
  };
  _email_verified_sended_message: Notification = {
    show: false,
    message: "Un email de vérification a bien été renvoyé."
  };
  _ids_error_message: Notification = {
    show: false,
    message: "Identifiant ou mot de passe invalide."
  };
  _sso_error_message: Notification = {
    show: true,
    message:
      "Si vous essayez de vous connecter grâce à une solution SSO mais que cela ne fonctionne pas il est tout à fait possible que vous ayez déjà un compte avec cette même adresse email créé dans notre base de données"
  };
  /** Loadings */
  _user_password_loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private formBuilder: FormBuilder,
    private recaptchaV3Service: ReCaptchaV3Service,
    private connectionService: ConnectionService
  ) {}

  ngOnInit() {
    this.connectionService
      .checkLogged()
      .then(() => (this._loadingPage = false))
      .catch(() => (this._loadingPage = false));
    this.titleService.setTitle("RetroSprint Digital - Connexion");
    const hash: undefined | null | "created-account" | "reset-password" = this
      .route.snapshot.fragment as
      | undefined
      | null
      | "created-account"
      | "reset-password";
    if (undefined !== hash && null !== hash) {
      window.location.hash = "";
      switch (hash) {
        case "created-account":
          this._success_message.show = true;
          break;
        case "reset-password":
          this._success_reset_password_message.show = true;
          break;
      }
    }
    this._emailCtrl = this.formBuilder.control("", Validators.email);
    this._passwordCtrl = this.formBuilder.control("", [Validators.required]);
    this._form = this.formBuilder.group({
      email: this._emailCtrl,
      password: this._passwordCtrl
    });
    const hideInfoConnectionMessage = window.localStorage.getItem(
      "hideInfoConnectionMessage"
    );
    if (hideInfoConnectionMessage !== null) {
      this._sso_error_message.show = false;
    }
  }

  submit() {
    this.initInvalid();
    this.hideAllMessages();
    if (this._form.status === "INVALID") {
      return;
    }
    this._subscription = this.recaptchaV3Service
      .execute("signin")
      .subscribe(_token => {
        this._user_password_loading = true;
        this.connectionService.connectionWithEmailAndPassword(this._form).then(
          () => {
            this._user_password_loading = false;
            const urlRedirect = this.connectionService.getUrlRedirect();
            if (null === urlRedirect) {
              this.router.navigate(["/profile"]);
            } else {
              this.router.navigate([
                `/${urlRedirect.component}/${urlRedirect.id}`
              ]);
            }
          },
          onreject => {
            this._user_password_loading = false;
            if (null !== onreject) {
              this._email_unverified_message.show = true;
            } else {
              this._ids_error_message.show = true;
            }
          }
        );
      });
  }

  connectWithMicrosoft() {
    this.connectionService.connectWithMicrosoft();
  }

  connectWithGithub() {
    this.connectionService.connectWithGithub();
  }

  connectWithGoogle() {
    this.connectionService.connectWithGoogle();
  }

  initInvalid() {
    if (this._emailCtrl.status === "INVALID") {
      this._form_status.email.error = true;
      this._form_status.email.valid = false;
    } else if (this._emailCtrl.status === "VALID") {
      this._form_status.email.error = false;
      this._form_status.email.valid = true;
    }
    if (this._passwordCtrl.status === "INVALID") {
      this._form_status.password.error = true;
      this._form_status.password.valid = false;
    } else if (this._passwordCtrl.status === "VALID") {
      this._form_status.password.error = false;
      this._form_status.password.valid = true;
    }
  }

  hideAllMessages() {
    this.hideEmailUnverifiedMessage();
    this.hideEmailVerifiedSendedMessage();
    this.hideIdsErrorMessage();
    this.hideSuccessMessage();
    this.hideSuccessResetPasswordMessage();
  }

  hideSuccessMessage() {
    this._success_message.show = false;
  }

  hideEmailUnverifiedMessage() {
    this._email_unverified_message.show = false;
  }

  hideIdsErrorMessage() {
    this._ids_error_message.show = false;
  }

  hideEmailVerifiedSendedMessage() {
    this._email_verified_sended_message.show = false;
  }

  hideSuccessResetPasswordMessage() {
    this._success_reset_password_message.show = false;
  }

  hideSSOInfo() {
    this._sso_error_message.show = false;
    window.localStorage.setItem("hideInfoConnectionMessage", "1");
  }

  resendVerificationMail(e) {
    e.preventDefault();

    this.connectionService
      .resendVerificationMail()
      .then(() => {
        this._email_unverified_message.show = false;
        this._email_verified_sended_message.show = true;
      })
      .catch(() => {
        this._email_unverified_message = {
          show: false,
          message: null
        };
      });
  }

  public ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
