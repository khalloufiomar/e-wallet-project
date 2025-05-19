import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-profile-settings-component',
  imports: [ FormsModule],
  templateUrl: './profile-settings-component.component.html',
  styleUrl: './profile-settings-component.component.css'
})
export class ProfileSettingsComponentComponent {
  constructor(private authService: AuthService) {}
  userName = '';
  userEmail = '';
  phone= '';
  ngOnInit(): void {
    this.getCurrentUserInfos();
  }
 getCurrentUserInfos() {
    this.authService.getCurrentUserInfos().subscribe({
      next: (res) => {
        console.log('User info:', res);
        this.userName = res.userName;
        this.userEmail = res.userEmail;
        this.phone = res.phone || '+216';
      },
      error: (err) => {
        console.error('Error fetching user info:', err);
      }
    });
  }
  updateUserInfos(userName: string, userEmail: string, phone: string) {
    this.authService.updateUserInfo(userName, userEmail, phone).subscribe({
      next: (res) => {
        
        console.log('User info updated successfully:', res);
        // Optionally show a success message or refresh the user info
      },
      error: (err) => {
        console.error('Error updating user info:', err);
      }
    });
  }

}

