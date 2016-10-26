'use strict';

import angular from 'angular';

export default angular.module('daletApp.constants', [])
  .constant('appConfig', require('../../server/config/environment/shared'))
  .name;
