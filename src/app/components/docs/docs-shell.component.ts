import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'CHANGEME-docs-shell',
    template: '<router-outlet></router-outlet>',
    imports: [RouterOutlet],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocsShellComponent {}
