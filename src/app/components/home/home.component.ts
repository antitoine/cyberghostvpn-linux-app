import { Component, OnInit } from '@angular/core';
import { CyberGhostService } from '../../core/services/cyberghost/cyber-ghost.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  cyberGhostAvailable$: Observable<boolean>;
  vpnConnect$: BehaviorSubject<boolean>;
  loading = false;
  faPowerOff = faPowerOff;

  constructor(
    private cyberGhostService: CyberGhostService,
  ) {
  }

  ngOnInit(): void {
    this.cyberGhostAvailable$ = this.cyberGhostService.isAvailable();
    //this.vpnConnect$ = this.cyberGhostService.isConnected().pipe(tap(() => this.loading = false));
    this.vpnConnect$ = new BehaviorSubject(true);
  }

  toggleConnection(): void {
    this.loading = true;
    setTimeout(() => {
      this.vpnConnect$.next(!this.vpnConnect$.getValue());
      this.loading = false;
    }, 5000);
  }
}
