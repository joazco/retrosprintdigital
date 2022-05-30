import { Directive, ElementRef, Input, AfterContentInit } from "@angular/core";

@Directive({
  selector: "[sprintAutofocus]"
})
export class AutofocusDirective implements AfterContentInit {
  @Input() public appAutoFocus: boolean;

  public constructor(private el: ElementRef) {}

  public ngAfterContentInit() {
    // setTimeout(() => {
    this.el.nativeElement.focus();
    // }, 100);
  }
}
