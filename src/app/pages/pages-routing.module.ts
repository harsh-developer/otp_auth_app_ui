import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
    {
        path: 'user',
        loadChildren: () => import('./user-list/user-list.module').then(m => m.UserListModule),
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})

export class PagesRoutingModule { }
