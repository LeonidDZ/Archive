import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SavedEntities } from 'src/app/models/saved-entities.model';
import { UserService } from 'src/app/service/user.service';

declare var $: any;

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('rowsPerPageSelector') rowsPerPageSelector: ElementRef;

  public pagesQuantity: number = 5;
  public pageNumbers: number[];
  public currPage: number = 0;
  public rowsPerPage: number = 10;
  private cookieName: string = 'savedRowsPerPageNumber';
  private btnsReady: boolean = false;
  private activatedPagesQuantityChanged: Subscription;
  

  constructor(
    private userService: UserService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.activatedPagesQuantityChanged =
      this.userService.pagesQuantityChanged.subscribe((o: SavedEntities) => {
        this.pagesQuantity = o.pagesQuantity;
        this.rowsPerPage = o.rowsPerPage;
        this.currPage = o.currPage;
        this.setRowsPerPage(this.rowsPerPage);
        this.currPage = this.userService.currPage;
      });
    // this.setCurrPage(this.userService.currPage);
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
  }

  setCurrPage(indx: number) {
    this.currPage = indx;
    this.setButtons(indx);
    this.waitForButtonExists(this.currPage);
    // this.setBtnStyles();
    // if (this.btnsReady) {
    //   this.userService.setCurrPage(this.currPage);
    // }
  }

  setCurrPage_continue(el: any) {
    this.btnsReady = true;
    $('li>a').removeClass('success');
    $(el).addClass('success');
    this.btnsReady = true;
    //this.setBtnStyles(el);
    this.userService.setCurrPage(this.currPage);
  }

  waitForButtonExists(currPage: number) {
    var lis = $('li');
    if (lis.length - 1 < currPage) {
      setTimeout(this.waitForButtonExists, 100, currPage);
    }
    else {
      $('li').each((indx: number) => {
        if (indx === currPage) {
          var el = $('#li' + indx + '>a');
          if (el.length === 0 || !el) {
            setTimeout(this.waitForButtonExists, 100, indx);
            return false;
          }
          else {
            this.setCurrPage_continue(el);
            return false;
          }
        }
        return true;
      })
    }
  }

  // setBtnStyles(el: any) {
  //   // $('li>a').removeClass('success');
  //   // $('li').each((indx: number) => {
  //     // if (indx === this.currPage) {
  //       $(el).addClass('success');
  //     // this.currPage = indx;
  //     //this.btnsReady = true;
  //     this.userService.setCurrPage(this.currPage);
  //     //this.forceSetBtnStyle(this.currPage);
  //     // }
  //   })
  // }

  forceSetBtnStyle(indx: number) {
    var el = $('#li' + indx + '>a');
    if (el.length === 0 || !el) {
      setTimeout(() => {
        this.forceSetBtnStyle(indx);
      }, 100);
    }
    else {
      $(el).addClass('success');
      this.currPage = indx;
      this.btnsReady = true;
      this.userService.setCurrPage(this.currPage);
    }
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
