import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private baseApiUrl = 'http://localhost:8069/api';

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/getUserNotifications`, {
      withCredentials: true,
    });
  }
  getCountUnreadNotifications(): Observable<{ notifCount: number }> {
    return this.http.get<{ notifCount: number }>(
      `${this.baseApiUrl}/countNotifications`,
      {
        withCredentials: true,
      }
    );
  }
  markAllNotificationsAsRead(): Observable<{ notifCount: number }> {
    return this.http.post<{ notifCount: number }>(
      `${this.baseApiUrl}/markAllAsRead`,
      {
        withCredentials: true,
      }
    );
  }
  addDeviceToken(token: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseApiUrl}/addDeviceToken`,
      { DeviceToken: token },
      { withCredentials: true }
    );
  }
}
