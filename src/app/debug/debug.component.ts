import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormArray,FormBuilder,ReactiveFormsModule, Validators ,FormControl, FormGroup} from '@angular/forms';
@Component({
  selector: 'app-debug',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule],
  templateUrl: './debug.component.html',
  styleUrl: './debug.component.css'
})
export class DebugComponent {
   constructor (private route: ActivatedRoute){
  }
  fb = inject(FormBuilder);
  routeForm = this.fb.group({
    route:['',Validators.required]
  })

}
