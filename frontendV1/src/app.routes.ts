import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { ProductsPage } from './app/pages/products/products.page';
import { CustomersPage } from './app/pages/customers/customers.page';
import { OrdersPage } from './app/pages/orders/orders.page';
import { PaymentsPage } from './app/pages/payments/payments.page';
import { OrdersListPage } from './app/pages/orders/orders-list.page';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'products', component: ProductsPage },
            { path: 'customers', component: CustomersPage },
            { path: 'orders', component: OrdersPage },
            { path: 'orders/list', component: OrdersListPage },
            { path: 'orders/:id', component: OrdersPage },
            { path: 'payments', component: PaymentsPage },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
