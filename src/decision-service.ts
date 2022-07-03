import {DecisionContext, FeatureFlag, Platform} from "./interfaces";
import compareVersions from "compare-versions";


export class DecisionService {
  private currentDecisionResult: boolean;
  private currentDecisionFeature?: FeatureFlag;
  private currentDecisionContext?: DecisionContext;

  constructor(private readonly flags: FeatureFlag[]) {
    this.flags = flags;
    this.currentDecisionResult = true;
  }

  private withContext(context: DecisionContext) {
    this.currentDecisionContext = context;
    return this;
  }

  private forFeature(feature: FeatureFlag) {
    this.currentDecisionFeature = feature;
    this.currentDecisionResult = this.currentDecisionFeature.active;
    return this;
  }

  private isActiveForList(key: keyof DecisionContext, list?: Array<string | number>) {
    const value = this.currentDecisionContext?.[key];
    if (value) {
      this.currentDecisionResult &&= list?.includes(value) ?? true;
    }
    return this;
  }

  private isActiveForCountry() {
    return this.isActiveForList('country', this.currentDecisionFeature?.countries)
  }

  private isActiveForRole() {
    return this.isActiveForList('role', this.currentDecisionFeature?.roles);
  }

  private isActiveForGvCode() {
    return this.isActiveForList('gvCode', this.currentDecisionFeature?.gvCodes);
  }

  private isActiveForPlatform() {
    const platform = this.currentDecisionContext?.platform

    const featurePlatforms = {
      [Platform.ios]: this.currentDecisionFeature?.enablediOS ?? false,
      [Platform.android]: this.currentDecisionFeature?.enabledAndroid ?? false,
      [Platform.web]: this.currentDecisionFeature?.enabledWeb ?? false,
    };

    const featureFlagRequiresPlatform =
      featurePlatforms[Platform.android] ||
      featurePlatforms[Platform.ios] ||
      featurePlatforms[Platform.web]

    if (!featureFlagRequiresPlatform) return this;

    this.currentDecisionResult &&=  featurePlatforms[platform!];
    return this;
  }

  private isActiveForMobileVersion() {
    const version = this.currentDecisionFeature?.allowMobileFromVersion;
    if (!version) return this;

    const contextVersion = this.currentDecisionContext!.mobileVersion;

    if (!contextVersion) {
      this.currentDecisionResult = false;
      return this;
    }

    const hasRequiredVersion = compareVersions(contextVersion, version) >= 0;
    this.currentDecisionResult &&= hasRequiredVersion;

    return this;
  }

  private result() {
    return this.currentDecisionResult;
  }

  isActive(name: string, context: DecisionContext) {
    const feature = this.flags.find(flag => flag.feature == name);
    if (!feature) return false;

    return this
      .forFeature(feature)
      .withContext(context)
      .isActiveForPlatform()
      .isActiveForCountry()
      .isActiveForGvCode()
      .isActiveForRole()
      .isActiveForMobileVersion()
      .result();
  }
}