import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as CdkBilim from '../lib/cdk-bilim-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CdkBilim.CdkBilimStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
