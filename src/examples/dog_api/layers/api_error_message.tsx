import * as React from "react";
import { composeReactLayer } from "../../../core";
import { ApiFeature } from "../types";
import { ErrorMessage } from "../components/error_message";

export type ApiErrorMessageScope = {
  api: ApiFeature;
};

export const ApiErrorMessage = composeReactLayer<ApiErrorMessageScope>(
  function({ status }) {
    const { error } = status.api;

    if (error) {
      return <ErrorMessage message={error} />;
    }

    return null;
  }
);
