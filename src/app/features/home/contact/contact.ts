import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';

const SWAL_THEME = {
  background: '#1B1313',
  color: '#E6E6E6',
  confirmButtonColor: '#ba5542',
  cancelButtonColor: '#3E211E',
  iconColor: '#ffd9b8',
  customClass: {
    popup: 'portfolio-swal',
    confirmButton: 'portfolio-swal-btn',
    title: 'portfolio-swal-title',
  },
};

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  readonly isSending = signal(false);

  contactForm = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    message: new FormControl<string>('', Validators.required),
  });

  submitForm(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      Swal.fire({
        ...SWAL_THEME,
        icon: 'warning',
        title: 'Incomplete form',
        text: 'Please fill in all required fields correctly.',
        confirmButtonText: 'OK',
      });
      return;
    }

    this.isSending.set(true);

    Swal.fire({
      ...SWAL_THEME,
      title: 'Sending your message...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    emailjs
      .send(
        'service_0a6ibzo',
        'template_amygs4i',
        {
          from_name: this.contactForm.get('name')?.value ?? '',
          email: this.contactForm.get('email')?.value ?? '',
          message: this.contactForm.get('message')?.value ?? '',
        },
        'xPwYcJgxZjiL3m6DI',
      )
      .then(() => {
        this.contactForm.reset();
        this.isSending.set(false);

        Swal.fire({
          ...SWAL_THEME,
          icon: 'success',
          title: 'Message sent!',
          text: 'Thank you — I will get back to you as soon as possible.',
          confirmButtonText: 'Great',
        });
      })
      .catch((error) => {
        console.error(error);
        this.isSending.set(false);

        Swal.fire({
          ...SWAL_THEME,
          icon: 'error',
          title: 'Could not send',
          text: 'Something went wrong. Please try again or email me directly.',
          confirmButtonText: 'Try again',
        });
      });
  }
}
