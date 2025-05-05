import { Injectable } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { EventEmitter, Output } from '@angular/core';
import { NotificationService } from './notification.service';
@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  constructor(private messaging: Messaging, private notificationService: NotificationService) {}
  @Output() newMessageEvent = new EventEmitter();

  // Ask permission and get token
  async requestPermission() {
    try {
      const token = await getToken(this.messaging, {
        vapidKey:
          'BOlt1FcDizSfNrjh8dD_kk7cKsYqTJcODxLVOFoWj8wqKwx_wRzLT4A9IvdGXM3WCNTngiy5-T7n5YK6MOVFV5M',
      });
      console.log('Device Token:', token);
      this.notificationService.addDeviceToken(token).subscribe(
        (data) => {
          console.log(data.message)
        },
        (error) => {
          console.error('Erreur', error);
        }
      );
      console.log
    } catch (err) {
      console.error('Permission denied', err);
    }
  }

  // Handle incoming messages
  listenForMessages() {
    onMessage(this.messaging, (payload) => {
      console.log('Message received:', payload);
      this.newMessageEvent.emit();
      // Customize how you show the message (alert, toast, etc.)
    });
  }
}
