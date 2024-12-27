import { Component } from '@angular/core';
import { FormGroup, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidatorComponent {


  alphabetValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty fields
      }
      const valid = /^[A-Za-z. ]+$/.test(control.value);
      return valid ? null : { alphabet: { value: control.value } };
    };
  }

  alphabetSpeclValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty fields
      }
      const valid = /^[A-Za-z. -()]+$/.test(control.value);
      return valid ? null : { alphabetspecl: { value: control.value } };
    };
  }
  jobcodeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty fields
      }
      const valid = /^[0-9A-Za-z-()]+$/.test(control.value);
      return valid ? null : { jobcodevalid: { value: control.value } };
    };
  }
  numberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty fields
      }
      const valid = /^[0-9]{1,50}$/.test(control.value);
      return valid ? null : { number: { value: control.value } };
    };
  }
  numbersAndFloatnumValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty fields
      }
      // /^[0-9]{0,2}(\.[0-9]{0,1})?$/
      const valid = /^(0|[1-9][0-9]{0,1})(\.[0-9]{0,1})?$/.test(control.value);
      return valid ? null : { floatnumbers: { value: control.value } };
    };
  }
  alphaSpaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty fields
      }
      // Define the regular expression pattern
      const valid = /^[A-Za-z ]+$/.test(control.value);
      // Return null if valid, otherwise return an error object
      return valid ? null : { alphaSpace: { value: control.value } };
    };
  }

  numbersdotsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty fields
      }
      const valid = /^\d{1,2}?$/.test(control.value);
      return valid ? null : { numbersdots: { value: control.value } };
    };
  }
  addressValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty fields
      }

      const valid = /^[a-zA-Z0-9\s,._\/\-\n]+$/.test(control.value);
      //const valid =/^[a-zA-Z0-9\\s,.-_-/ ]+$/.test(control.value);
      return valid ? null : { Address: { value: control.value } };
    };
  }
  alphaNumaricValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty fields
      }
      const valid = /^[0-9A-Za-z._ ]+$/.test(control.value);
      return valid ? null : { alphanumaric: { value: control.value } };
    };
  }

  usernameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty fields
      }
      // Define the regular expression pattern
      const valid = /^[A-Za-z._ ]{1,50}$/.test(control.value);
      // Return null if valid, otherwise return an error object
      return valid ? null : { username: { value: control.value } };
    };
  }

  //----//
  onlynumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty fields
      }
      const valid = /^[0-9]{10}$/.test(control.value);
      return valid ? null : { onlynumber: { value: control.value } };
    };
  }
  digitsOnly(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty fields
      }
      const valid = /^[1-9]{1}[0-9]{0,5}$/.test(control.value);
      return valid ? null : { digits: { value: control.value } };
    };
  }
  emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty fields
      }
      const valid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(control.value);
      return valid ? null : { emailvalidate: { value: control.value } };
    };
  }
  designationValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty fields
      }
      const valid = /^[a-zA-Z\\s\-\\. ]+$/.test(control.value);
      return valid ? null : { designationValid: { value: control.value } };
    };
  }
  bankNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty fields
      }
      const valid = /^[A-Za-z\s\-']{1,50}$/.test(control.value);
      return valid ? null : { bankname: { value: control.value } };
    };
  }

  bankbranchNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty fields
      }
      const valid = /^[A-Za-z0-9\s\-',.]+$/.test(control.value);
      return valid ? null : { branchname: { value: control.value } };
    };
  }
  accountnumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty fields
      }
      const valid = /^\d{1,18}$/.test(control.value);
      return valid ? null : { accountnumber: { value: control.value } };
    };
  }
  ifscnumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty fields
      }
      const valid = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(control.value);
      return valid ? null : { ifscnumber: { value: control.value } };
    };
  }
  gstnumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty fields
      }
      const valid = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(control.value);
      return valid ? null : { gstnumber: { value: control.value } };
    };
  }
  panNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty fields
      }
      const valid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(control.value);
      return valid ? null : { pannumber: { value: control.value } };
    };
  }
  msmeCodeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty fields
      }
      // const valid =   /^[A-Z]{2}[0-9]{2}[A-Z]{1}[0-9]{7}$/.test(control.value);
      const valid = /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/.test(control.value);
      return valid ? null : { msmenumber: { value: control.value } };
    };
  }
  micrCodeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty fields
      }
      const valid = /^\d{9}$/.test(control.value);
      return valid ? null : { micrcode: { value: control.value } };
    };
  }

  minAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null; // Don't validate empty fields
      }
      const birthDate = new Date(control.value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age;
      }

      return age >= minAge ? null : { minAge: { value: control.value } };
    };
  }


  greaterThanValidator(min: string, max: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const minControl = formGroup.get(min);
      const maxControl = formGroup.get(max);

      if (!minControl || !maxControl) {
        return null;
      }

      if (
        maxControl.errors &&
        !maxControl.errors["passwordMismatch"]
      ) {
        return null;
      }

      if (minControl.value > maxControl.value) {
        maxControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        maxControl.setErrors(null);
        return null;
      }
    };
  }
  maxLengthValidator(maxLength: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value && control.value.length > maxLength) {
        return { 'maxLength': { actualLength: control.value.length, maxLength: maxLength } };
      }
      return null;
    };
  }
  negativeValueValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null; // Don't validate empty fields
      }
      const isNegative = control.value < 0;
      return isNegative ? { negativeValue: { value: control.value } } : null;
    };
  }

  sumNotGreaterThan100Validator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      // Get the form group
      const formGroup = control as FormGroup;

      // Extract values from the form controls
      const scSkillWeightage = formGroup.get('scSkillWeightage')?.value || 0;
      const scEducationWeightage = formGroup.get('scEducationWeightage')?.value || 0;
      const scExperienceWeightage = formGroup.get('scExperienceWeightage')?.value || 0;

      // Calculate the sum
      const total = +scSkillWeightage + +scEducationWeightage + +scExperienceWeightage;

      // Check if total is greater than 100
      return total > 100 ? { 'sumNotAllowed': true } : null;
    };
  }
  maxGreaterThanMinValidator(minField: string, maxField: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const minControl = formGroup.get(minField);
      const maxControl = formGroup.get(maxField);

      // If controls are not initialized or are invalid, do not set errors
      if (!minControl || !maxControl || minControl.errors || maxControl.errors) {
        return null;
      }

      const minSalary = parseFloat(minControl.value);
      const maxSalary = parseFloat(maxControl.value);

      if (isNaN(minSalary) || isNaN(maxSalary)) {
        return null; // Skip validation if the inputs are not valid numbers
      }

      if (maxSalary <= minSalary) {
        maxControl.setErrors({ 'maxNotGreaterThanMin': true });
      } else {
        maxControl.setErrors(null);
      }

      return null;
    };
  }


  maxGreaterThanMinValidator2(minField: string, maxField: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const minControl = formGroup.get(minField);
      const maxControl = formGroup.get(maxField);

      // If controls are not initialized or are invalid, do not set errors
      if (!minControl || !maxControl || minControl.errors || maxControl.errors) {
        return null;
      }

      const minSalary = parseFloat(minControl.value);
      const maxSalary = parseFloat(maxControl.value);

      if (isNaN(minSalary) || isNaN(maxSalary)) {
        return null; // Skip validation if the inputs are not valid numbers
      }

      if (maxSalary <= minSalary) {
        minControl.setErrors({ 'minNotGreaterThanMin': true });
      } else {
        minControl.setErrors(null);
      }

      return null;
    };
  }
  MinValidator(weightageField: string, scoreField: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const weightageControl = formGroup.get(weightageField);

      if (!weightageControl) return null;

      const weightageValue = parseFloat(weightageControl.value);

      if (isNaN(weightageValue)) return null; // Skip if weightage is not a number

      const optionsArray = formGroup.get('options') as FormGroup;

      if (!optionsArray || !Array.isArray(optionsArray.controls)) return null;

      let hasError = false;

      optionsArray.controls.forEach(optionControl => {
        const scoreControl = optionControl.get(scoreField);

        if (!scoreControl) return;

        const scoreValue = parseFloat(scoreControl.value);

        if (isNaN(scoreValue)) return; // Skip if score is not a number

        if (scoreValue > weightageValue) {
          scoreControl.setErrors({ 'scoreNotLessThanWeightage': true });
          hasError = true;
        } else {
          scoreControl.setErrors(null); // Clear errors if validation passes
        }
      });

      return null;
    };
  }


  MinValidator2(weightageField: string, scoreField: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const weightageControl = formGroup.get(weightageField);

      if (!weightageControl) return null;

      const weightageValue = parseFloat(weightageControl.value);

      if (isNaN(weightageValue)) return null; // Skip if weightage is not a number

      const optionsArray = formGroup.get('conditions') as FormGroup;

      if (!optionsArray || !Array.isArray(optionsArray.controls)) return null;

      let hasError = false;

      optionsArray.controls.forEach(optionControl => {
        const scoreControl = optionControl.get(scoreField);

        if (!scoreControl) return;

        const scoreValue = parseFloat(scoreControl.value);

        if (isNaN(scoreValue)) return; // Skip if score is not a number

        if (scoreValue > weightageValue) {
          scoreControl.setErrors({ 'scoreNotLessThanWeightage': true });
          hasError = true;
        } else {
          scoreControl.setErrors(null); // Clear errors if validation passes
        }
      });

      return null;
    };
  }


  // Custom Validator Function for null value 
  nullValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isValid = control.value && control.value !== 'null';
      return isValid ? null : { 'nullRequired': { value: control.value } };
    };
  }

  passwordValidValidator() {
    return (control: AbstractControl) => {
      // if (!control.value) {
      //   return null; // Don't validate empty fields
      // }
      const password: string = control.value || '';

      const errors: any = {};

      if (!/[a-z]/.test(password)) {
        errors.lowercase = true;
      }

      if (!/[A-Z]/.test(password)) {
        errors.uppercase = true;
      }

      if (!/\d/.test(password)) {
        errors.digit = true;
      }

      if (!/[^\w\s]/.test(password)) {  // Non-alphanumeric characters
        errors.nonAlphanumeric = true;
      }

      if (password.length < 12) {
        errors.minLength = true;
      }

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }


  dateRangeValidator(startField: string, endField: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const startControl = formGroup.get(startField);
      const endControl = formGroup.get(endField);

      if (!startControl || !endControl || startControl.errors || endControl.errors) {
        return null;
      }

      const startDate = new Date(startControl.value);
      const endDate = new Date(endControl.value);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return null; // Skip validation if the inputs are not valid dates
      }

      if (endDate <= startDate) {
        endControl.setErrors({ 'endDateNotAfterStartDate': true });
      } else {
        endControl.setErrors(null);
      }

      return null;
    };
  }


}
