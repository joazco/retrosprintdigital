import { Component } from "@angular/core";
import * as moment from "moment";
import "moment/locale/fr";
moment.locale("fr");

export type Notification = {
  show: boolean;
  message: string;
};

@Component({
  selector: "sprint-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor() {}
}
