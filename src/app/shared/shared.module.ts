import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  IxIconsModule,
  IxPipesModule,
  IxScrollModule,
  IxScrollProgressModule,
  IxTableHeaderModule,
  IxThemeButtonModule
} from '@pyrophire/ix-libs';
import { NgPipesModule } from 'ngx-pipes';
import { MaterialModule } from '../material.module';
import { FooterComponent } from './components/footer/footer.component';
import { NavItemComponent } from './components/navigation/nav-item/nav-item.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { NgSelectErrorComponent } from './components/ng-select-error/ng-select-error.component';
import { TfIconComponent } from './components/tf-icon/tf-icon.component';
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

const componentItems = [NavigationComponent, FooterComponent, TfIconComponent, NgSelectErrorComponent];

@NgModule({
  declarations: [componentItems, NavItemComponent],
  imports: [CommonModule, sharedModules],
  exports: [sharedModules, componentItems]
})
export class SharedModule {}
