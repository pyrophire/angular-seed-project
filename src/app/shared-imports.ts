import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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
import { MATERIAL_IMPORTS } from './material-imports';

/**
 * Array of commonly used modules for standalone components.
 * Import this array in your standalone component's imports when you need the full set of shared functionality.
 */
export const SHARED_IMPORTS = [
    CommonModule,
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
    NgSelectModule,
    ...MATERIAL_IMPORTS
] as const;
