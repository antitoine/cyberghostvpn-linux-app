import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ElectronService } from './core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  inElectronApp: boolean;

  constructor(private translate: TranslateService, private electronService: ElectronService) {
    this.translate.setDefaultLang('en');
    this.inElectronApp = this.electronService.isElectron;
  }
}
