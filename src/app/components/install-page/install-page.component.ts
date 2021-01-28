import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CyberGhostService } from '../../core/services/cyberghost/cyber-ghost.service';

@Component({
  selector: 'cg-detail-page',
  templateUrl: './install-page.component.html',
  styleUrls: ['./install-page.component.scss']
})
export class InstallPageComponent implements OnInit {
  cyberGhostCommandAvailable$: Observable<boolean>;
  sudoCommandAvailable$: Observable<boolean>;

  constructor(
    private cyberGhostService: CyberGhostService,
  ) {}

  ngOnInit(): void {
    this.cyberGhostCommandAvailable$ = this.cyberGhostService.isCommandAvailable();
    this.sudoCommandAvailable$ = this.cyberGhostService.isSudoAvailable();
  }
}
