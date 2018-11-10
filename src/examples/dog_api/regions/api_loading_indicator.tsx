import * as React from "react";
import { composeRegion } from "../../../core";
import { ApiScope } from "../types";
import { ErrorMessage } from "../components/error_message";
import { LoadingIndicator } from "../components/loading_indicator";

export type ApiLoadingIndicatorScope = ApiScope;

export const ApiLoadingIndicator = composeRegion<ApiLoadingIndicatorScope>(
  function({ status }) {
    const { loading } = status.api;

    if (loading) {
      return <LoadingIndicator />;
    }

    return null;
  }
);
