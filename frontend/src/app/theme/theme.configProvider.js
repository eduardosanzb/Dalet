/**
 * Created by k.danovsky on 13.05.2016.
 */

(function () {
  'use strict';

  var basic = {
    default: '#ffffff',
    defaultText: '#666666',
    border: '#dddddd',
    borderDark: '#aaaaaa',
  };

  // main functional color scheme
  var colorScheme = {
    primary: '#E91E63',
    info: '#009688',
    success: '#8BC34A',
    warning: '#FFC107',
    danger: '#FF5252',
  };


  // dashboard colors for charts
  var dashboardColors = {
    blueStone: '#C2185B',
    surfieGreen: '#E91E63',
    silverTree: '#F8BBD0',
    gossip: '#F44336',
    white: '#C2185B',
  };

  angular.module('BlurAdmin.theme')
    .provider('baConfig', configProvider);

  /** @ngInject */
  function configProvider(colorHelper) {
    var conf = {
      theme: {
        blur: false,
      },
      colors: {
        default: basic.default,
        defaultText: basic.defaultText,
        border: basic.border,
        borderDark: basic.borderDark,

        primary: colorScheme.primary,
        info: colorScheme.info,
        success: colorScheme.success,
        warning: colorScheme.warning,
        danger: colorScheme.danger,

        primaryLight: colorHelper.tint(colorScheme.primary, 30),
        infoLight: colorHelper.tint(colorScheme.info, 30),
        successLight: colorHelper.tint(colorScheme.success, 30),
        warningLight: colorHelper.tint(colorScheme.warning, 30),
        dangerLight: colorHelper.tint(colorScheme.danger, 30),

        primaryDark: colorHelper.shade(colorScheme.primary, 15),
        infoDark: colorHelper.shade(colorScheme.info, 15),
        successDark: colorHelper.shade(colorScheme.success, 15),
        warningDark: colorHelper.shade(colorScheme.warning, 15),
        dangerDark: colorHelper.shade(colorScheme.danger, 15),

        dashboard: {
          blueStone: dashboardColors.blueStone,
          surfieGreen: dashboardColors.surfieGreen,
          silverTree: dashboardColors.silverTree,
          gossip: dashboardColors.gossip,
          white: dashboardColors.white,
        },
      }
    };

    conf.changeTheme = function(theme) {
      angular.merge(conf.theme, theme)
    };

    conf.changeColors = function(colors) {
      angular.merge(conf.colors, colors)
    };

    conf.$get = function () {
      delete conf.$get;
      return conf;
    };
    return conf;
  }
})();
