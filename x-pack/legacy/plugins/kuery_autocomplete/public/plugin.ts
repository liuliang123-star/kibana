/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { PluginInitializerContext, CoreSetup, CoreStart, Plugin } from 'src/core/public';
import { Plugin as DataPublicPlugin } from '../../../../../src/plugins/data/public';
import { setAutocompleteService } from './services';
import { setupKqlQuerySuggestionProvider } from './kql_query_suggestion';

/** @internal */
export interface KueryAutocompletePluginSetupDependencies {
  data: ReturnType<DataPublicPlugin['setup']>;
}

/** @internal */
export interface KueryAutocompletePluginStartDependencies {
  data: ReturnType<DataPublicPlugin['start']>;
}

const KUERY_LANGUAGE_NAME = 'kuery';

/** @internal */
export class KueryAutocompletePlugin implements Plugin<Promise<void>, void> {
  initializerContext: PluginInitializerContext;

  constructor(initializerContext: PluginInitializerContext) {
    this.initializerContext = initializerContext;
  }

  public async setup(core: CoreSetup, plugins: KueryAutocompletePluginSetupDependencies) {
    const kueryProvider = setupKqlQuerySuggestionProvider(core);

    plugins.data.autocomplete.addQuerySuggestionProvider(KUERY_LANGUAGE_NAME, kueryProvider);
  }

  public start(core: CoreStart, plugins: KueryAutocompletePluginStartDependencies) {
    setAutocompleteService(plugins.data.autocomplete);
  }
}
