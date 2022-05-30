import { Component, OnInit } from "@angular/core";

@Component({
  selector: "sprint-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  _buger_menu_is_open: boolean = true;
  constructor() {}

  ngOnInit() {}
}
