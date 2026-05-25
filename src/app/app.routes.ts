import { Routes } from '@angular/router';
import { Layout } from './features/layout/layout';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
            {
                path: '',
                loadComponent: () => import('./features/home/home').then(m => m.Home)
            }
        ]
    }
];
