import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeAppComponent } from './homeApp/home-app.component';
import { RouterModule,Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    children:[
      {
        path:'',
        redirectTo: 'homeApp',
        pathMatch: 'full'
      },
      {
        path: 'homeApp',
        component: HomeAppComponent
      },
    ]
  }
];

@NgModule({
  declarations: [
    HomeAppComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [RouterModule]
})
export class HomeModule { }
