# Feature Toggle Library

This simple library provides an agnostic data fetching interface (WIP) and a decision service.

# Feature Toggle Decisions

To make use of the decision service, you need to fetch the flags from you source, with the following interface:

```typescript
export interface FeatureFlag {
  active: boolean;
  feature: string;
  enabledAndroid?: boolean;
  enablediOS?: boolean;
  enabledWeb?: boolean;
  allowMobileFromVersion?: string;
  roles?: Role[];
  gvCodes?: number[];
  release?: ReleaseOptions[];
  countries?: Country[];
}
```
> You can find the enums, nested types and field descriptions on [interfaces.ts](../src/interfaces.ts) file.

Then, you must create a `DecisionService` instance and use the `isEnabled` method. 
This method receives two parameters:

- the feature flag name;
- the context to be used on the decision;

```typescript
import {DecisionService} from "@squad-fv/feature-flags";

const flags = yourConnector.getFlags();
const service = new DecisionService(flags);

// ... later on your code

const isFeatureFlagEnabled = service.isEnabled('FEATURE_TOGGLE_NAME', context);
```
> You can also find the context interface on the [interfaces.ts](../src/interfaces.ts) file.

# Roadmap
- Country based decisions;
- Release based decisions;
- Flag fetching from remote backends;
- Type support for flag names for `isEnabled` method;
- Service level context support