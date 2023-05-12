import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SavedEntities } from 'src/app/models/saved-entities.model';
import { UserService } from 'src/app/service/user.service';

declare var $: any;

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, OnDestroy {

  self: PaginatorComponent = this;

  @ViewChild('rowsPerPageSelector') rowsPerPageSelector: ElementRef;

  public pagesQuantity: number = 5;
  public pageNumbers: number[];
  public currPage: number = 0;
  public rowsPerPage: number = 10;
  private activatedPagesQuantityChanged: Subscription;
  public elementReady: boolean = false;


  constructor(
    private userService: UserService) { }
    
  ngOnInit() {
    this.activatedPagesQuantityChanged =
      this.userService.pagesQuantityChanged.subscribe((o: SavedEntities) => {
        this.pagesQuantity = o.pagesQuantity;
        this.rowsPerPage = o.rowsPerPage;
        this.currPage = o.currPage;
        this.setRowsPerPage(this.rowsPerPage);
        this.currPage = this.userService.currPage;
      });
  }

  ngOnDestroy() {
    this.activatedPagesQuantityChanged.unsubscribe();
  }

  setRowsPerPage(evt: any) {
    if (typeof evt === 'object') {
      this.rowsPerPage = parseInt(evt.currentTarget.value);
      this.userService.setRowsPerPage(this.rowsPerPage);
      this.userService.setPagesQuantity();
    }
    this.pagesQuantity = this.userService.pagesQuantity;
    this.setCurrPage(this.currPage);
  }
  
  setCurrPage(indx: number) {
    this.currPage = indx;
    this.userService.setCurrPage(this.currPage);
    setTimeout(this.setButtonsStyle, 100, this.currPage);
  }


  setButtonsStyle(indx: number) {
    $('li>a').removeClass('success');
    $('#li' + indx + '>a').addClass('success');
  }

  updateCurrPage(indx: number) {
    this.currPage = this.userService.currPage;
    this.currPage += indx;
    this.currPage = this.currPage < 0 ? 0 : this.currPage;
    this.currPage = this.currPage > this.pagesQuantity - 1 ? this.pagesQuantity - 1 : this.currPage;
    this.setCurrPage(this.currPage);
  }

  getColor(i: number) {
    let style = i === this.rowsPerPage - 1 ? 'font-weight:bold;color:red;' : 'font-weight:regular;color:black;';
    return style;
  }
}
