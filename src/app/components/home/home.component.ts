import { Component, OnInit } from '@angular/core';
import { CyberGhostService } from '../../core/services/cyberghost/cyber-ghost.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  cyberGhostAvailable$: Observable<boolean>;

  constructor(
    private cyberGhostService: CyberGhostService,
  ) {}

  ngOnInit(): void {
    this.cyberGhostAvailable$ = this.cyberGhostService.isAvailable();
  }
}
