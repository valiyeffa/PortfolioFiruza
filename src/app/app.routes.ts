import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Layout } from './features/layout/layout';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
            {
                path: '',
                component: Home,
            },
        ],
    },
];
