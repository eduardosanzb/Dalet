'use strict';
// @flow

type User = {
  name: string;
  email: string;
  password: string;
};

export default class LoginController {
  user: User = {
    name: '',
    email: '',
    password: ''
  };
  errors = {
    login: undefined
  };
  submitted = false;
  Auth;
  $state;
  $rootScope
  hello = "hols"

  /*@ngInject*/
  constructor(Auth, $state, $rootScope) {
    this.Auth = Auth;
    this.$state = $state;
    this.$rootScope = $rootScope
  }

  login(form) {
    this.submitted = true;

    if(form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
        .then((response) => {
          // Logged in, redirect to home
          console.log(response)
          console.log(this.$rootScope)
          this.$rootScope.myroles = response.role
          this.$state.go('main');
        })
        .catch(err => {
          this.errors.login = err.message;
        });
    }
  }
}
