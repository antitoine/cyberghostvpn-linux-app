import { Injectable, NgZone } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Connection, Country } from './cyber-ghost.model';

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
    return this.exec('command -v cyberghostvpn && echo "ok"').pipe(
      map(([stdin]) => stdin?.split('\n')?.[1] === 'ok'),
    );
  }

  isSudoAvailable(): Observable<boolean> {
    return this.exec('sudo -n cyberghostvpn >/dev/null && echo "ok"').pipe(
      map(([stdin]) => stdin?.split('\n')?.[0] === 'ok'),
    );
  }

  isConnected(): Observable<boolean> {
    return this.exec('sudo cyberghostvpn --status').pipe(
      map(([stdin]) => stdin?.split('\n')?.[0] === 'VPN connection found.'),
    );
  }

  countries(): Observable<Country[]> {
    return this.exec('sudo cyberghostvpn --country-code').pipe(
      map(([stdin]) =>
        stdin?.split('\n')?.slice(3, -2)?.map(line => {
          const [id, name, code] = line?.split('|')?.slice(1, -1);
          return {
            id: id?.trim(),
            name: name?.trim(),
            code: code?.trim(),
          };
        }),
      ),
    );
  }

  connections(countryCode: string): Observable<Connection[]> {
    return this.exec('sudo cyberghostvpn --country-code ' + countryCode + ' --connection').pipe(
      map(([stdin]) =>
        stdin?.split('\n')?.slice(3, -2)?.map(line => {
          const [id, city, instance, load] = line?.split('|')?.slice(1, -1);
          return {
            id: id?.trim(),
            city: city?.trim(),
            instance: parseInt(instance),
            load,
          };
        }),
      ),
    );
  }

  connect(countryCode: string = null, cityName: string = null): Observable<void> {
    let command = 'sudo cyberghostvpn';
    if (countryCode) {
      command += ' --country-code ' + countryCode;
    }
    if (cityName) {
      command += ' --city ' + cityName;
    }
    command += ' --connect';
    return this.exec(command).pipe(map(() => {}));
  }

  disconnect(): Observable<void> {
    return this.exec('sudo cyberghostvpn --stop').pipe(map(() => {}));
  }
}
