import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "sprint-chip",
  templateUrl: "./chip.component.html",
  styleUrls: ["./chip.component.scss"]
})
export class ChipComponent implements OnInit {
  @Input() active: boolean = false;
  @Input() close: boolean = false;
  @Input() activeColor: string = "#2980b9";
  @Input() checkbox: boolean = false;
  @Input() disabled: boolean = false;

  constructor() {}

  ngOnInit() {}

  style() {
    let style = {};
    if (this.active) {
      style["background-color"] = this.activeColor;
      style["color"] = "white";
    }
    if (this.disabled) {
      style["border"] = "1px solid #999999";
      style["background-color"] = "#cccccc";
      style["color"] = "#666666";
    }
    return style;
  }
}
