import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { CountryService } from '../../services/country.service';
import { CountryIResponse } from 'src/app/models/country.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['id', 'name', 'operations'];
  dataSource: MatTableDataSource<CountryIResponse, MatTableDataSourcePaginator>;

  subscription1$: Subscription
  subscription2$: Subscription

  constructor(
    private countryService: CountryService,
  ) {

  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.subscription1$ = this.countryService.getAll().subscribe(res => {
      this.dataSource = new MatTableDataSource<CountryIResponse>(res);

      this.paginator._intl.itemsPerPageLabel = 'Items por página';
      this.paginator._intl.firstPageLabel = 'Primera página';
      this.paginator._intl.lastPageLabel = 'Ultima página';
      this.paginator._intl.nextPageLabel = 'Siguiente página';
      this.paginator._intl.previousPageLabel = 'Anterior página';
      this.dataSource.paginator = this.paginator;
    })
  }
  
  delete(id: number) {
    this.subscription2$ = this.countryService.delete(id).subscribe(() => {
      const indice = this.dataSource.data.indexOf(this.dataSource.data.find(data => data.id == id))
      this.dataSource.data.splice(indice, 1)
      this.dataSource._updateChangeSubscription()
    })
  }

  ngOnDestroy(): void {
    this.subscription1$.unsubscribe()
    if(this.subscription2$){
      this.subscription2$.unsubscribe()
    }
  }
}