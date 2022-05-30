import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "sprint-loading",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.scss"]
})
export class LoadingComponent implements OnInit {
  @Input() text: string = null;
  _show_spinner: boolean = false;
  constructor() {}

  ngOnInit() {
    setTimeout(() => (this._show_spinner = true), 1000);
  }
}
