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
import { InvoicesComponent } from './links/invoices/invoices.component';
import { InvoiceDetailsComponent } from './links/invoice-details/invoice-details.component';
import { StoreComponent } from './links/store/store.component';
import { AccountsComponent } from './dashbord/Links admin/accounts/accounts.component';
import { DashadminComponent } from './dashbord/Links admin/dashadmin/dashadmin.component';
import { CompaniesComponent } from './dashbord/Links admin/companies/companies.component';
import { AddcompanyComponent } from './dashbord/Links admin/addcompany/addcompany.component';
import { ProductsComponent } from './dashbord/Links admin/products/products.component';

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
    //canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'transfer', component: TransferComponent },
      { path: 'buyCoins', component: BuyCoinsComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'invoices', component: InvoicesComponent },
      { path: 'invoice-details/:id', component: InvoiceDetailsComponent },
      { path: 'store', component: StoreComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
  {
    path: 'admin',
    component: AdminComponent,
    //canActivate: [authGuard], // 🔒 Protège aussi la page admin
    children: [
      { path: 'accounts', component: AccountsComponent },
      { path: 'dashboard', component: DashadminComponent },
      { path: 'companies', component: CompaniesComponent },
      { path: 'addcompany', component: AddcompanyComponent },
      { path: 'product', component: ProductsComponent },
    ],
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
