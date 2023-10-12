import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoomService } from '../../services/room.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TypeIResponse } from 'src/app/models/type.model';
import { TypeService } from 'src/app/type/services/type.service';

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.component.html',
  styleUrls: ['./edit-room.component.scss']
})
export class EditRoomComponent {
  edit: FormGroup
  id: number
  room = {
    price: 0,
    ac: true,
    tv: true,
    shower: true,
    towel: true
  }
  types: TypeIResponse[]

  subscription1$: Subscription
  subscription2$: Subscription
  subscription3$: Subscription
  subscription4$: Subscription

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private router: Router,
    private route: ActivatedRoute,
    private typeService: TypeService) {
      this.subscription1$ = this.route.params.subscribe(params => {
        this.id = params['id']

        this.subscription2$ = this.roomService.getOne(this.id).subscribe(res => {
          this.room = res
          this.edit.controls['price'].setValue(this.room.price)
        })
        
        this.subscription3$ = this.typeService.getAll().subscribe(res => {
          this.types = res
        })
      })
    }

  ngOnInit(): void {
      this.edit = this.initForm()
  }

  initForm(): FormGroup {
    return this.fb.group({
      'price': ['', [Validators.required]],
      'typeId': ['', [Validators.required]],
      'ac': [''],
      'tv': [''],
      'towel': [''],
      'shower': [''],
    })
  }

  onSubmit() {
    console.log(this.edit.controls['price'].value)
    if(this.edit.valid){
      const room = {
        'price': this.edit.controls['price'].value,
        'typeId': this.edit.controls['typeId'].value,
        'ac': this.edit.controls['ac'].value,
        'tv': this.edit.controls['tv'].value,
        'towel': this.edit.controls['towel'].value,
        'shower': this.edit.controls['shower'].value
      }
      this.subscription4$ = this.roomService.edit(room, this.id).subscribe(() => {
        this.router.navigateByUrl('/room')
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