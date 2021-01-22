import { Component, OnInit } from '@angular/core';
import { CyberGhostService } from '../../core/services/cyberghost/cyber-ghost.service';
import { Observable } from 'rxjs';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { tap } from 'rxjs/operators';
import { Connection, Country } from '../../core/services/cyberghost/cyber-ghost.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  cyberGhostAvailable$: Observable<boolean>;
  vpnConnect$: Observable<boolean>;
  loading = false;
  faPowerOff = faPowerOff;
  countries$: Observable<Country[]>;
  connections$: Observable<Connection[]>;

  constructor(
    private cyberGhostService: CyberGhostService,
  ) {
  }

  ngOnInit(): void {
    this.cyberGhostAvailable$ = this.cyberGhostService.isAvailable();
    this.vpnConnect$ = this.cyberGhostService.isConnected().pipe(tap(() => this.loading = false));
    this.countries$ = this.cyberGhostService.countries();
  }

  onCountryChange(countryCode: string) {
    console.log('Load connection for country ' + countryCode);
    this.connections$ = this.cyberGhostService.connections(countryCode);
  }

  toggleConnection(): void {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 5000);
  }
}
