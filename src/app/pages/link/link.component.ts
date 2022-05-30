import { Component, OnInit } from "@angular/core";
import { ProfileService } from "src/app/services/profile/profile.service";
import { LinkService } from "src/app/services/link/link.service";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "sprint-link",
  templateUrl: "./link.component.html",
  styleUrls: ["./link.component.scss"]
})
export class LinkComponent implements OnInit {
  _loadingPage: boolean = true;
  _text: string = "Connexion.....";
  constructor(
    private profileService: ProfileService,
    private linkService: LinkService,
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.profileService
        .initCurrentUser({
          component: "join",
          id: params.id
        })
        .then(user => {
          this.titleService.setTitle("Retro Sprint Digital");
          this.linkService
            .connectToLink(params.id, user)
            .then(sprintId => this.router.navigate([`/sessions/${sprintId}`]))
            .catch(reason => (this._text = reason));
        });
    });
  }
}
