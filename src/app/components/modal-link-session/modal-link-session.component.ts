import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { LinkService } from "src/app/services/link/link.service";

@Component({
  selector: "sprint-modal-link-session",
  templateUrl: "./modal-link-session.component.html",
  styleUrls: ["./modal-link-session.component.scss"]
})
export class ModalLinkSessionComponent implements OnInit {
  @Output() hideModal: EventEmitter<boolean> = new EventEmitter();
  @Input() link: string;

  _url: string;
  _is_copy: boolean = false;

  constructor(private linkService: LinkService) {}

  ngOnInit() {
    this._url = `${window.location.origin}/join/${this.link}`;
    this.linkService.updateEnable(this.link);
  }

  copy() {
    this._is_copy = false;
    setTimeout(() => {
      let copyText: any = document.querySelector("#input-link-copy");
      copyText.select();
      document.execCommand("copy");
      this._is_copy = true;
    }, 200);
  }
}
