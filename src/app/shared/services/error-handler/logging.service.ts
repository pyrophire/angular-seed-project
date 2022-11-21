import { Injectable, Type, Injector } from '@angular/core';

import {
  SlansLoggingClientService,
  ApplicationEnvironment,
  SlansProcessingOptions,
  SlansSeverity
} from 'angular-slans-logging-client-library';
import { environment } from '@environments/environment';
import { SlansModel } from './slans.model';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  constructor(private slansService: SlansLoggingClientService, private injector: Injector) {
    this.slansService.inSession().inTransaction().withDefaults({
      applicationId: environment.slansAppName,
      environment: this.setSlansEnvironment(),
      processOverride: SlansProcessingOptions.Log
    });
  }

  log(feature: string, action: string, details: any, severity: SlansSeverity = SlansSeverity.Info): void {
    this.slansService
      .inTransaction()
      .log({
        details,
        feature,
        action,
        severity
      })
      .subscribe();
  }

  errorToSlansMapper(error: any): SlansModel {
    const slansModel = new SlansModel();
    const router = this.injector.get<Router>(Router as Type<Router>);
    let details: string;
    if (error instanceof HttpErrorResponse) {
      details = `url: ${error.url} / status: ${error.status} / message: ${error.message}`;
    } else {
      details = `url: ${router.routerState.snapshot.url} / message: ${error.message} / stack: ${error.stack}`;
    }
    let feature;
    if (router.routerState.snapshot.url) {
      feature = router.routerState.snapshot.url.split('/')[1].toLowerCase();
    } else {
      feature = 'unknown feature';
    }
    if (feature.indexOf('?') > -1) {
      feature = feature.substring(0, feature.indexOf('?'));
    }
    feature = feature.charAt(0).toUpperCase() + feature.slice(1);
    slansModel.feature = feature;
    slansModel.action = 'Exception';
    slansModel.details = details;

    return slansModel;
  }

  setSlansEnvironment(): ApplicationEnvironment {
    switch (environment.envName.toUpperCase()) {
      case 'DEV': {
        return ApplicationEnvironment.Dev;
      }
      case 'TST': {
        return ApplicationEnvironment.Test;
      }
      case 'PRD': {
        return ApplicationEnvironment.Prod;
      }
      case 'LOCAL': {
        return ApplicationEnvironment.Dev;
      }
    }
  }
}
