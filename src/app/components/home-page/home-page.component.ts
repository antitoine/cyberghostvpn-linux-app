import { Component, OnInit } from '@angular/core';
import { CyberGhostService } from '../../core/services/cyberghost/cyber-ghost.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { first, switchMap, tap } from 'rxjs/operators';
import { Connection, Country } from '../../core/services/cyberghost/cyber-ghost.model';

const countryCodePreference = 'fr';
const cityNamePreference = 'paris';

@Component({
  selector: 'cg-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  cyberGhostAvailable$: Observable<boolean>;
  vpnConnect$ = new BehaviorSubject<boolean>(false);
  loading = false;
  faPowerOff = faPowerOff;
  countries$: Observable<Country[]>;
  connections$: Observable<Connection[]>;
  advancedMode = false;
  selectedCountryCode = countryCodePreference;
  selectedCityName = cityNamePreference;

  constructor(
    private cyberGhostService: CyberGhostService,
  ) {
  }

  ngOnInit(): void {
    this.cyberGhostAvailable$ = this.cyberGhostService.isAvailable();
    this.cyberGhostService.isConnected().pipe(first()).subscribe(isConnected => {
      this.vpnConnect$.next(isConnected);
      this.loading = false;
    });
    this.countries$ = this.cyberGhostService.countries();
  }

  onCountryChange(countryCode: string): void {
    this.selectedCountryCode = countryCode;
    this.connections$ = this.cyberGhostService.connections(countryCode);
  }

  toggleConnection(): void {
    this.loading = true;
    this.cyberGhostService.isConnected().pipe(
      switchMap(isConnected => {
        if (isConnected) {
          return this.cyberGhostService.disconnect();
        } else {
          return this.cyberGhostService.connect(this.selectedCountryCode, this.selectedCityName);
        }
      }),
      switchMap(() => this.cyberGhostService.isConnected()),
    ).subscribe(isConnected => {
      this.vpnConnect$.next(isConnected);
      this.loading = false;
    });
  }

  toggleAdvancedMode(): void {
    this.advancedMode = !this.advancedMode;
  }
}
