import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { getPaginatorIntl } from './paginator-intl';

@Component({
  selector: 'app-paginator',
  standalone: false,
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  providers: [
    { provide: MatPaginatorIntl, useFactory: getPaginatorIntl }
  ],
})
export class PaginatorComponent {
  
  @ViewChild(MatPaginator) paginator!: MatPaginator

  @Input() length = 0
  @Input() pageIndex = 0
  @Input() pageSize = 15
  @Input() pageSizeOptions: number[] = [15, 30, 50, 100]

  @Output() pageChange = new EventEmitter<PageEvent>()
}
