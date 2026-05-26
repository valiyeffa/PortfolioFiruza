import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})

export class Contact {
  contactForm = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    message: new FormControl<string>('', Validators.required),
  })

  submitForm() {
    if (this.contactForm.invalid) {
      alert('Not allowed empty input!');
      return;
    }
    emailjs.send(
      'service_0a6ibzo',
      'template_amygs4i',
      {
        from_name: this.contactForm.get('name')?.value,
        email: this.contactForm.get('email')?.value,
        message: this.contactForm.get('message')?.value,
      },
      'xPwYcJgxZjiL3m6DI'
    )
      .then(() => {
        alert('Email sent successfully!');
        this.contactForm.patchValue({
          name: '',
          email: '',
          message: '',
        });

      })
      .catch((error) => {
        console.error(error);
        alert('Failed to send email');
      });

  }
}
