import { Injectable, NgZone } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CyberGhostService {

  private exec: (command: string) => Observable<string[]> = (command: string) => {
    return new Observable(observer => {
      this.ngZone.runOutsideAngular(() => {
        this.electronService.childProcess.exec(command, (err, stdout, stderr) => {
          this.ngZone.run(() => {
            if (err) {
              observer.error(err);
            } else {
              observer.next([stdout, stderr]);
            }
            observer.complete();
          });
        });
      });
    });
  };

  constructor(private electronService: ElectronService, private ngZone: NgZone,) {
  }

  isAvailable(): Observable<boolean> {
    return this.isCommandAvailable().pipe(switchMap(isCommandAvailable => {
      if (isCommandAvailable) {
        return this.isSudoAvailable();
      }
      return of(false);
    }));
  }

  isCommandAvailable(): Observable<boolean> {
    return this.exec('command -v cyberghostvpn && echo "ok"').pipe(map(([stdin]) => stdin?.split('\n')?.[1] === 'ok'));
  }

  isSudoAvailable(): Observable<boolean> {
    return this.exec('sudo -n cyberghostvpn >/dev/null && echo "ok"').pipe(map(([stdin]) => stdin?.split('\n')?.[0] === 'ok'));
  }

  isConnected(): Observable<boolean> {
    return this.exec('sudo cyberghostvpn --status').pipe(map(([stdin]) => stdin?.split('\n')?.[0] === 'VPN connection found.'));
  }
}
