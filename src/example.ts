import {Country, DecisionContext, FeatureFlag, Platform, Role} from './interfaces'
import {DecisionService} from "./decision-service";

const flgs: FeatureFlag[] = [{
  feature: 'SHOW_SEARCH_FOR_SV_AND_GN',
  active: true,
  roles: [
    Role.SV,
    Role.GN
  ],
}];

const service = new DecisionService(flgs);

const context: DecisionContext = {
  gvCode: 123,
  role: Role.SV,
  country: Country.ARGENTINA,
  mobileVersion: '1.0.0',
  platform: Platform.ios,
};

const isSearchEnabled = service.isActive('SHOW_SEARCH_FOR_SV_AND_GN', context);

if(isSearchEnabled) {
  console.log('You should show the search based on current context');
}
else {
  console.log('You should not show the search based on current context');
}