import * as React from "react";

export type ErrorMessageProps = {
  message: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  return <span>{message}</span>;
}
