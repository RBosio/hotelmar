import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { UserLoginI } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  tokenEvent: EventEmitter<boolean> = new EventEmitter()

  constructor(
    private http: HttpClient,
    ) { }

  login(user: UserLoginI) {
    return this.http.post(environment.BASE_URL + 'auth/login', user)
    .pipe(
      map((res: any) => {
        this.tokenEvent.emit(true);
        return res
      }),
      catchError(err => {
        return throwError(err.error.message)
      })
    )
  }

  logout(): void {
    this.tokenEvent.emit(false);
    localStorage.clear();
  }
}