import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { AuthGuard } from './guards/auth-guard.guard';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { LiveVisitorsComponent } from './components/live-visitors/live-visitors.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: ProductListComponent, canActivate: [AuthGuard] },
  { path: 'analytics', component: AnalyticsComponent, canActivate: [AuthGuard] },
  { path: 'live-visitors', component: LiveVisitorsComponent, canActivate: [AuthGuard] },
  { path: 'add-product', component: ProductFormComponent, canActivate: [AuthGuard] },
  { path: 'edit-product/:id', component: ProductFormComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
