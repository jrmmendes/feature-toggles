export enum Role {
  CN = 'CN',
  GN = 'GN',
  SV = 'SV',
  LIDER = "LIDER"
}

export enum Country {
  BRASIL = "BR",
  CHILE = "CL",
  ARGENTINA = "AR",
  MEXICO = "MX",
  COLOMBIA = "CO",
}

export interface ReleaseOptions {
  gvCodes?: number[];
  availableFrom: Date;
}

export enum Platform {
  web = "web",
  ios = "ios",
  android = "android"
}

export interface FeatureFlag {
  /**
   * Turns the toggle active or inactive (base condition)
   */
  active: boolean;

  /**
   * Feature Name
   */
  feature: string;

  /**
   * Enable or disable on Android devices
   */
  enabledAndroid?: boolean;

  /**
   * Enable or disable on iOS devices
   */
  enablediOS?: boolean;

  /**
   * Enable or disable on web application
   */
  enabledWeb?: boolean;

  /**
   * Set a minimum required version for enabling the feature on mobile devices
   */
  allowMobileFromVersion?: string;

  /**
   * Enable for specific list of roles
   */
  roles?: Role[];

  /**
   * Enable for specific list of gvs
   */
  gvCodes?: number[];

  /**
   * Add release specific settings
   */
  release?: ReleaseOptions[];

  /**
   * Enable for specific list of countries
   */
  countries?: Country[];
}


export interface DecisionContext {
  country: Country;
  role: Role;
  gvCode: number;
  mobileVersion?: string;
  platform: Platform;
}