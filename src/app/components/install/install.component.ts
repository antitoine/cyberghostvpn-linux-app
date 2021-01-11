import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CyberGhostService } from '../../core/services/cyberghost/cyber-ghost.service';

@Component({
  selector: 'app-detail',
  templateUrl: './install.component.html',
  styleUrls: ['./install.component.scss']
})
export class InstallComponent  implements OnInit {
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
