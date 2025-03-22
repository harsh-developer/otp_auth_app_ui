import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list.component';
import { ApiService } from 'src/app/core/services/api.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

@NgModule({
    declarations: [
        UserListComponent,
    ],
    imports: [
        CommonModule,
        NgbModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: "list", component: UserListComponent, canActivate: [AuthGuard] },
        ]),
        NgxSpinnerModule
    ]
})


export class UserListModule { }