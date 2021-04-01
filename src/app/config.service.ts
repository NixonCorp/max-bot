import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private jsonURL = 'assets/config.json';
  private telegramURL = 'https://api.telegram.org/bot';

  constructor(private http: HttpClient) {
  }

  public getJSON(): Observable<any> {
    return this.http.get(this.jsonURL)
      .pipe(map((response: any) => {
          return response;
        },
        error => console.log(error)));


  }

  public register(message: string, token: string, groupId: string): Observable<any> {
    return this.http.get(`${this.telegramURL}${token}/sendMessage?chat_id=${groupId}&text=${message}`);
  }
}
