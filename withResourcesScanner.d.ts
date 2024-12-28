declare module "withResourcesScanner" {
  export interface Resource {
    id: string;
    name: string;
    type: string;
    path: string;
  }

  export interface ScanOptions {
    recursive?: boolean;
    filter?: (resource: Resource) => boolean;
  }

  export function scanResources(
    directory: string,
    options?: ScanOptions
  ): Promise<Resource[]>;

  export function getResourceById(id: string): Promise<Resource | null>;
}
