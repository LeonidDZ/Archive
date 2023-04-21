import { Component, OnInit} from '@angular/core';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [UserService]
})
export class MainComponent implements OnInit {

  constructor(private userService: UserService){}

  ngOnInit(): void {
    this.userService.readAllData();
  }
}
