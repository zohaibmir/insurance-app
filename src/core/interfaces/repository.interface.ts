/**
 * src/core/interfaces/respository.interface.ts
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */
export interface Repository {
    create(data: any): Promise<any>;
    update(id: number, data: any): Promise<any>;
    findById(id: number): Promise<any>;
  }
  