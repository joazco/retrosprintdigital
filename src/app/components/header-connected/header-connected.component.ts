import { Component, OnInit, Input } from "@angular/core";
import { ConnectionService } from "src/app/services/connection/connection.service";
import { Router } from "@angular/router";

@Component({
  selector: "sprint-header-connected",
  templateUrl: "./header-connected.component.html",
  styleUrls: ["./header-connected.component.scss"]
})
export class HeaderConnectedComponent implements OnInit {
  @Input() current: "session" | "profile" = null;
  _buger_menu_is_open: boolean = false;

  constructor(
    private router: Router,
    private connectionService: ConnectionService
  ) {}

  ngOnInit() {}

  disconnect() {
    this.connectionService
      .disconnect()
      .then(() => this.router.navigate(["/"]))
      .catch(() => this.router.navigate(["/"]));
  }
}
