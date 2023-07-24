import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProvinceService } from '../../services/province.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryIResponse } from 'src/app/models/country.model';
import { CountryService } from 'src/app/country/services/country.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-province',
  templateUrl: './edit-province.component.html',
  styleUrls: ['./edit-province.component.scss']
})
export class EditProvinceComponent {
  edit: FormGroup
  id: number
  name: string
  countries: CountryIResponse[]

  subscription1$: Subscription
  subscription2$: Subscription
  subscription3$: Subscription
  subscription4$: Subscription

  constructor(
    private fb: FormBuilder,
    private provinceService: ProvinceService,
    private router: Router,
    private route: ActivatedRoute,
    private countryService: CountryService) {
      this.subscription1$ = this.route.params.subscribe(params => {
        this.id = params['id']

        this.subscription2$ = this.provinceService.getOne(this.id).subscribe(res => {
          this.name = res.name
        })
        
        this.subscription3$ = this.countryService.getAll().subscribe(res => {
          this.countries = res
        })
      })
    }

  ngOnInit(): void {
      this.edit = this.initForm()
  }

  initForm(): FormGroup {
    return this.fb.group({
      'name': ['', [Validators.required]],
      'countryId': ['', [Validators.required]]
    })
  }

  onSubmit() {
    if(this.edit.valid){
      const province = {
        'name': this.edit.controls['name'].value,
        'countryId': this.edit.controls['countryId'].value
      }
      this.subscription4$ = this.provinceService.edit(province, this.id).subscribe(() => {
        this.router.navigateByUrl('/province')
      })
    }
  }

  ngOnDestroy(): void {
    this.subscription1$.unsubscribe()
    this.subscription2$.unsubscribe()
    this.subscription3$.unsubscribe()
    if(this.subscription4$){
      this.subscription4$.unsubscribe()
    }
  }
}
