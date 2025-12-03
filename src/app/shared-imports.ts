import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import {
    AmPmPipe,
    CamelToTitlePipe,
    FileSizePipe,
    IxTableComponent,
    IxTableHeaderComponent,
    PhonePipe,
    SafePipe,
    ScrollBarProgressComponent,
    ScrollTopButtonComponent,
    ThemeButtonComponent,
    ThemeMenuItemComponent
} from '@pyrophire/ix-libs';
import { NgPipesModule } from 'ngx-pipes';
import { MATERIAL_IMPORTS } from './material-imports';

/**
 * Array of commonly used modules and standalone components for standalone components.
 * Import this array in your standalone component's imports when you need the full set of shared functionality.
 *
 * Note: With ix-libs 21.1.0+, all components and pipes are standalone. Import them directly where needed.
 * Icons are registered via provideIxIcons() in app.config.ts.
 */
export const SHARED_IMPORTS = [
    CommonModule,
    HttpClientModule,
    NgPipesModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollTopButtonComponent,
    ScrollBarProgressComponent,
    ThemeButtonComponent,
    ThemeMenuItemComponent,
    IxTableComponent,
    IxTableHeaderComponent,
    AmPmPipe,
    CamelToTitlePipe,
    FileSizePipe,
    PhonePipe,
    SafePipe,
    NgSelectModule,
    ...MATERIAL_IMPORTS
] as const;
