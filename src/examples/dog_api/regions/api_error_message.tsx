import * as React from "react";
import { composeRegion } from "../../../core";
import { ApiScope } from "../types";
import { ErrorMessage } from "../components/error_message";

export type ApiErrorMessageScope = ApiScope;

export const ApiErrorMessage = composeRegion<ApiErrorMessageScope>(function({
  status
}) {
  const { error } = status.api;

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return null;
});
