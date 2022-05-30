import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "sprint-cgu",
  templateUrl: "./cgu.component.html",
  styleUrls: ["./cgu.component.scss"]
})
export class CguComponent implements OnInit {
  @Output() hideModal: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
