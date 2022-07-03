import {Country, DecisionContext, Platform, Role} from "./interfaces";
import {DecisionService} from "./decision-service";

describe('Feature Flag Decision Service', () => {

  describe('Base Case', () => {
    test.each(['enabled', 'disabled'])
    ('When feature is %s, expect result to be correct', (testCase) => {
      const shouldBeActive = testCase === 'enabled';
      const service = new DecisionService([{
        feature: 'TEST_FEATURE',
        active: shouldBeActive
      }]);

      const context: DecisionContext = {
        role: Role.CN,
        gvCode: 123,
        country: Country.ARGENTINA,
        mobileVersion: '1.2.3',
        platform: Platform.ios
      };

      const result = service.isActive('TEST_FEATURE', context);
      expect(result).toBe(shouldBeActive);
    })

    test('When feature not defined, expect result to be false', () => {
      const service = new DecisionService([{
        feature: 'TEST_FEATURE',
        active: true,
      }]);

      const context: DecisionContext = {
        role: Role.CN,
        gvCode: 123,
        country: Country.ARGENTINA,
        mobileVersion: '1.2.3',
        platform: Platform.ios
      };

      const result = service.isActive('INVALID_FEATURE_NAME', context);
      expect(result).toBe(false);
    });
  })

  describe('Decisions based on context role', () => {
    test('When context have at least one required role for feature, expect result to be true', () => {
      const service = new DecisionService([{
        feature: 'TEST_FEATURE',
        active: true,
        roles: [
          Role.CN,
          Role.GN
        ]
      }]);

      const context: DecisionContext = {
        role: Role.CN,
        gvCode: 123,
        country: Country.ARGENTINA,
        mobileVersion: '1.2.3',
        platform: Platform.ios
      };

      const result = service.isActive('TEST_FEATURE', context);
      expect(result).toBe(true);
    });

    test('When context don\'t have at least one required role for feature, expect result to be false', () => {
      const service = new DecisionService([{
        feature: 'TEST_FEATURE',
        active: true,
        roles: [
          Role.CN,
          Role.GN
        ]
      }]);

      const context: DecisionContext = {
        role: Role.SV,
        gvCode: 123,
        country: Country.ARGENTINA,
        mobileVersion: '1.2.3',
        platform: Platform.ios
      };

      const result = service.isActive('TEST_FEATURE', context);
      expect(result).toBe(false);
    });
  });

  describe('Decisions based on context gv codes', () => {
    test('When context have at least one required gv code for feature, expect result to be true', () => {
      const service = new DecisionService([{
        feature: 'TEST_FEATURE',
        active: true,
        gvCodes: [123]
      }]);

      const context: DecisionContext = {
        role: Role.CN,
        gvCode: 123,
        country: Country.ARGENTINA,
        mobileVersion: '1.2.3',
        platform: Platform.ios
      };

      const result = service.isActive('TEST_FEATURE', context);
      expect(result).toBe(true);
    });

    test('When context don\'t have at least one required gv role for feature, expect result to be false', () => {
      const service = new DecisionService([{
        feature: 'TEST_FEATURE',
        active: true,
        gvCodes: [123]
      }]);

      const context: DecisionContext = {
        role: Role.SV,
        gvCode: 456,
        country: Country.ARGENTINA,
        mobileVersion: '1.2.3',
        platform: Platform.ios
      };

      const result = service.isActive('TEST_FEATURE', context);
      expect(result).toBe(false);
    });
  });

  describe('Decisions based on platform information', () => {
    test.each([Platform.ios, Platform.android, Platform.web])
    ('When %s specific filter matches the context value, expect result to be true', (platform) => {
      const service = new DecisionService([{
        feature: `TEST_FEATURE`,
        active: true,
        enabledAndroid: platform == Platform.android,
        enablediOS: platform == Platform.ios,
        enabledWeb: platform == Platform.web,
      }]);

      const context: DecisionContext = {
        role: Role.CN,
        gvCode: 123,
        country: Country.ARGENTINA,
        mobileVersion: '1.2.3',
        platform,
      };

      const result = service.isActive('TEST_FEATURE', context);
      expect(result).toBe(true);
    });

    test.each([Platform.ios, Platform.android, Platform.web])
    ('When %s specific filter doesn\'t matches the context value, expect result to be false', (platform) => {
      const service = new DecisionService([{
        feature: `TEST_FEATURE`,
        active: true,
        enabledAndroid: platform !== Platform.android,
        enablediOS: platform !== Platform.ios,
        enabledWeb: platform !== Platform.web,
      }]);

      const context: DecisionContext = {
        role: Role.CN,
        gvCode: 123,
        country: Country.ARGENTINA,
        mobileVersion: '1.2.3',
        platform,
      };

      const result = service.isActive('TEST_FEATURE', context);
      expect(result).toBe(false);
    })
  })

  describe('Decisions based on platform version', () => {
    test.each(['2.1.3', '1.4.0', '1.2.3'])
    ('When context has minimum required mobile version, expect result to be true', (mobileVersion) => {
      const service = new DecisionService([{
        feature: 'TEST_FEATURE',
        active: true,
        allowMobileFromVersion: '1.2.3'
      }]);

      const context: DecisionContext = {
        role: Role.CN,
        gvCode: 123,
        country: Country.ARGENTINA,
        mobileVersion,
        platform: Platform.ios
      };

      const result = service.isActive('TEST_FEATURE', context);
      expect(result).toBe(true)
    });

    test.each(['1.3.4', '2.1.4', '2.3.1'])
    ('When context hasn\'t minimum required mobile version, expect result to be false', (mobileVersion) => {
      const service = new DecisionService([{
        feature: 'TEST_FEATURE',
        active: true,
        allowMobileFromVersion: '2.3.4'
      }]);

      const context: DecisionContext = {
        role: Role.CN,
        gvCode: 123,
        country: Country.ARGENTINA,
        mobileVersion,
        platform: Platform.ios
      };

      const result = service.isActive('TEST_FEATURE', context);
      expect(result).toBe(false)
    });
  })
})