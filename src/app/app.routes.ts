import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UserComponent } from './dashbord/user/user.component';
import { AdminComponent } from './dashbord/admin/admin.component';
import { EnteremailComponent } from './reset password/enteremail/enteremail.component';
import { EmailsentComponent } from './reset password/emailsent/emailsent.component';
import { UpdatepasswordComponent } from './reset password/updatepassword/updatepassword.component';
import { DashboardComponent } from './links/dashboard/dashboard.component';
import { TransactionsComponent } from './links/transactions/transactions.component';
import { TransferComponent } from './links/transfer/transfer.component';
import { NotificationsComponent } from './links/notifications/notifications.component';
import { BuyCoinsComponent } from './links/buycoins/buycoins.component';
import { SettingsComponent } from './links/settings/settings.component';
import { ProfileSettingsComponentComponent } from './settings links/profilesettings/profile-settings-component.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'transfer', component: TransferComponent },
      { path: 'buyCoins', component: BuyCoinsComponent },
      { path: 'notifications', component: NotificationsComponent },
      {
        path: 'settings',
        component: SettingsComponent,
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' },
          { path: 'profile', component: ProfileSettingsComponentComponent },
        ],
      },
    ],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard], // 🔒 Protège aussi la page admin
  },
  {
    path: 'enteremail',
    component: EnteremailComponent,
  },
  {
    path: 'emailsent',
    component: EmailsentComponent,
  },
  {
    path: 'updatepassword',
    component: UpdatepasswordComponent,
  },
];
