import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';

interface Feature {
    title: string;
    description: string;
}

@Component({
    selector: 'CHANGEME-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [CommonModule, SharedModule]
})
export class HomeComponent implements OnInit {
    features: Feature[] = [
        {
            title: 'Easy to Use',
            description: 'Our intuitive interface makes it simple to get started.'
        },
        {
            title: 'Powerful Analytics',
            description: 'Get insights with our advanced analytics tools.'
        },
        {
            title: 'Secure & Reliable',
            description: 'Your data is safe with our enterprise-grade security.'
        },
        {
            title: 'Responsive Design',
            description: 'Works perfectly on any device or screen size.'
        }
    ];

    currentYear: number = new Date().getFullYear();

    constructor(private router: Router) {}

    ngOnInit(): void {
        // Initialization code
    }

    navigateToFeatures(): void {
        this.router.navigate(['/features']);
    }
}
