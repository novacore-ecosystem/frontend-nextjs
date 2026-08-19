export interface TenantOption {
  id: string;
  name: string;
  /** The value to send as the tenant public/client key once selected. */
  clientKey: string;
}

/** The consuming application's adapter over its own tenant-directory API. */
export interface TenantDirectoryService {
  searchTenants(query: string): Promise<TenantOption[]>;
}
