import * as React from "react";
import { composeReactLayer } from "../../../core";
import { ApiFeature } from "../types";
import { ErrorMessage } from "../components/error_message";
import { LoadingIndicator } from "../components/loading_indicator";

export type ApiLoadingIndicatorScope = {
  api: ApiFeature;
};

export const ApiLoadingIndicator = composeReactLayer<ApiLoadingIndicatorScope>(
  function({ status }) {
    const { loading } = status.api;

    if (loading) {
      return <LoadingIndicator />;
    }

    return null;
  }
);
