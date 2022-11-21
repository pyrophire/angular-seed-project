import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { IxIconsModule, IxPipesModule, IxScrollModule, IxScrollProgressModule, IxTableHeaderModule, IxThemeButtonModule } from 'ix-libs';
import { NgPipesModule } from 'ngx-pipes';
import { FooterComponent } from './components/footer/footer.component';

import { NavigationComponent } from './components/navigation/navigation.component';
import { TfIconComponent } from './components/tf-icon/tf-icon.component';

import { MaterialModule } from '../material.module';
import { NavItemComponent } from './components/navigation/nav-item/nav-item.component';
import { CustomPipesModule } from './pipes/custom-pipes.module';

// sharedModules are going to be available for all modules that import SharedModule
const sharedModules = [
  MaterialModule,
  CustomPipesModule,
  HttpClientModule,
  NgPipesModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  IxIconsModule,
  IxScrollModule,
  IxThemeButtonModule,
  IxPipesModule,
  IxTableHeaderModule,
  IxScrollProgressModule,
  NgSelectModule
];

const componentItems = [NavigationComponent, FooterComponent, TfIconComponent];

@NgModule({
  declarations: [componentItems, NavItemComponent],
  imports: [CommonModule, sharedModules],
  exports: [sharedModules, componentItems]
})
export class SharedModule {}
