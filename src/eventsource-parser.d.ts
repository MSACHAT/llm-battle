// eventsource-parser.d.ts
declare module "eventsource-parser" {
  export function createParser(
    streamParser: (event: ParsedEvent | ReconnectInterval) => void,
  ): any; // Replace 'any' with the actual expected type
  export type ParsedEvent = any; // Replace 'any' with the actual expected type
  export type ReconnectInterval = any; // Replace 'any' with the actual expected type
}
