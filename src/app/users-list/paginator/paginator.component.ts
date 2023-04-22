import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';

declare var $: any;

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, AfterViewInit {

  @ViewChild('rowsPerPageSelector') rowsPerPageSelector: ElementRef;
  public pagesQuantity: number = 5;
  public pageNumbers: number[];
  public currPage: number = 0;
  public rowsPerPage: number = 10;
  private cookieName: string = 'savedRowsPerPageNumber';

  constructor(
    private userService: UserService) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.userService.pagesQuantityChanged.subscribe((pq: number, cp: number) => {
      this.pagesQuantity = pq;
      this.rowsPerPage = this.userService.rowsPerPage;
      this.setRowsPerPage(this.rowsPerPage);
      this.currPage = cp;
    });
    this.setCurrPage(this.userService.currPage);
  }

  setRowsPerPage(evt: any) {
    if (typeof evt === 'object') {
      this.rowsPerPage = parseInt(evt.currentTarget.value);
      this.userService.setRowsPerPage(this.rowsPerPage);
      this.userService.setPagesQuantity();
    }
    this.pagesQuantity = this.userService.pagesQuantity;
  }

  setCurrPage(indx: number) {
    this.currPage = indx;
    this.setButtons(indx);
    this.userService.setCurrPage(this.currPage);
    this.setBtnStyles();
  }

  setBtnStyles(){
    $('li>a').removeClass('success');
    $('li').each((indx: number) => {
      if(indx === this.currPage){
      $('#li' + indx + '>a').addClass('success');
      }
    })
  }

  updateCurrPage(indx: number) {
    this.currPage = this.userService.currPage;
    this.currPage += indx;
    this.currPage = this.currPage < 0 ? 0 : this.currPage;
    this.currPage = this.currPage > this.pagesQuantity - 1 ? this.pagesQuantity - 1 : this.currPage;
    this.setCurrPage(this.currPage);
  }

  setButtons(indx: number) {

  }

  getColor(i: number) {
    let style = i === this.rowsPerPage - 1 ? 'font-weight:bold;color:red;' : 'font-weight:regular;color:black;';
    return style;
  }
}
