import { APIGatewayProxyEvent } from 'aws-lambda';

export const getHeader = (
  event: APIGatewayProxyEvent,
  headerName: string
): boolean | number | string | undefined => {
  if (!event.headers) return undefined;

  const headerKey = Object.keys(event.headers).find(
    (key) => key.toLowerCase() === headerName.toLowerCase()
  );

  return headerKey ? event.headers[headerKey] : undefined;
};
