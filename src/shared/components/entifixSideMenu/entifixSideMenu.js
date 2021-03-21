(function () {
    'use strict';
   
    function componentcontroller(EntifixConfig, $mdMedia, $mdSidenav)
    {
        var vm = this;

        //Fields and Properties__________________________________________________________________________________________________________________________________________________ 
        //=======================================================================================================================================================================
        //=======================================================================================================================================================================



        //Methods________________________________________________________________________________________________________________________________________________________________ 
        //=======================================================================================================================================================================

        vm.$onInit = function()
        {
            ($mdMedia('gt-md')) ? vm.fixedSideBar = true : vm.fixedSideBar = false;
        };
        
        
        vm.closeSideNavPanel = () => {
            $mdSidenav('left').close();
            vm.fixedSideBar = !vm.fixedSideBar;
        };

        vm.clickElement = (element) => {
            if (element && element.click) {
                element.click();
            }

            if (element && (element.click || element.state)) {
                if (!$mdMedia('gt-md')) {
                    $mdSidenav("left").close();
                }
            }
        };

        vm.evalPermissions = (element) => {
            if (EntifixConfig.devMode.get()) {
                return true;
            }

            if (element.securityContext) {
                return EntifixSession.checkPermissions(element.securityContext)
            }
            else {
                return true;
            }
        }
 
        //=======================================================================================================================================================================
    };

    componentcontroller.$inject = ['EntifixConfig', '$mdMedia', '$mdSidenav'];

    var component = 
    {
        bindings: 
        {
            navbarElements: '<',
            sideMenuImage: '<',

        },
        //templateUrl: 'src/shared/components/entifixSideMenu/entifixSideMenu.html',
        template: ' \
            <md-sidenav class="md-sidenav-left mp-sidenav" md-component-id="left" md-is-locked-open="vm.fixedSideBar" md-whiteframe="4" flex> \
                <md-content md-scroll-y flex layout="column"> \
                    <md-sidemenu locked="true"> \
                        <md-sidemenu-group> \
                            <md-toolbar layout="row" class="md-tall" md-colors="::{background: \'default-primary-50\'}"> \
                                <div class="md-toolbar-tools"> \
                                    <div layout="column" flex> \
                                        <img src="{{vm.sidemenuImage}}" class="side-menu-logo"> \
                                    </div> \
                                    <span flex></span> \
                                    <md-button class="md-icon-button" aria-label="Cerrar Menú" ng-click="vm.closeSideNavPanel()"> \
                                        <md-tooltip>Cerrar Menú</md-tooltip> \
                                        <md-icon class="material-icons" style="color:#000;">clear</md-icon> \
                                    </md-button> \
                                </div> \
                            </md-toolbar> \
                            <md-sidemenu-content ng-repeat="element in vm.navbarElements" md-icon="{{element.icon}}" md-heading="{{element.name}}" md-arrow="{{element.submenuItems}}" ng-click="vm.clickElement(element)" ng-if="vm.evalPermissions(element)" collapse-other="true" > \
                                <md-sidemenu-button ng-show="element.submenuItems" ng-repeat="subelement in element.submenuItems" ui-sref="{{subelement.state}}" ng-click="vm.clickElement(subelement)" ng-if="vm.evalPermissions(subelement)">{{subelement.name}}</md-sidemenu-button> \
                            </md-sidemenu-content> \
                        </md-sidemenu-group> \
                    </md-sidemenu> \
                </md-content> \
            </md-sidenav> \
        ',
        controller: componentcontroller,
        controllerAs: 'vm'
    };

    angular.module('entifix-js').component('entifixSideMenu', component);

})();