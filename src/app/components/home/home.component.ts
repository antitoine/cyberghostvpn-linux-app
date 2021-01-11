import { Component, OnInit } from '@angular/core';
import { CyberGhostService } from '../../core/services/cyberghost/cyber-ghost.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  cyberGhostAvailable$: Observable<boolean>;
  vpnConnect$: Observable<boolean>;
  loading = true;
  faPowerOff = faPowerOff;

  constructor(
    private cyberGhostService: CyberGhostService,
  ) {
  }

  ngOnInit(): void {
    this.cyberGhostAvailable$ = this.cyberGhostService.isAvailable();
    this.vpnConnect$ = this.cyberGhostService.isConnected().pipe(tap(() => this.loading = false));
  }

  toggleConnection(): void {
    this.loading = true;
  }
}
