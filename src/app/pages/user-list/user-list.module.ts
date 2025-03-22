import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list.component';
import { ApiService } from 'src/app/core/services/api.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        UserListComponent,
    ],
    imports: [
        CommonModule,
        NgbModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: "", component: UserListComponent }
        ]),
        NgxSpinnerModule
    ]
})


export class UserListModule { }