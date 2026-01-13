import type { OutlineConfig, OutlineCollection, OutlineDocument, OutlineSearchResult, DocumentListParams, DocumentSearchParams, DocumentCreateParams, DocumentUpdateParams, DocumentMoveParams, CollectionCreateParams, CollectionUpdateParams } from './types.js';
export declare class OutlineClient {
    private baseUrl;
    private apiKey;
    constructor(config: OutlineConfig);
    private request;
    private sleep;
    private fetchAllPages;
    listCollections(): Promise<OutlineCollection[]>;
    getCollection(id: string): Promise<OutlineCollection>;
    listDocuments(params?: DocumentListParams): Promise<OutlineDocument[]>;
    getDocument(id: string): Promise<OutlineDocument>;
    searchDocuments(params: DocumentSearchParams): Promise<OutlineSearchResult[]>;
    createDocument(params: DocumentCreateParams): Promise<OutlineDocument>;
    updateDocument(params: DocumentUpdateParams): Promise<OutlineDocument>;
    moveDocument(params: DocumentMoveParams): Promise<OutlineDocument[]>;
    deleteDocument(id: string, permanent?: boolean): Promise<void>;
    archiveDocument(id: string): Promise<OutlineDocument>;
    unarchiveDocument(id: string): Promise<OutlineDocument>;
    listDrafts(): Promise<OutlineDocument[]>;
    exportDocument(id: string): Promise<string>;
    createCollection(params: CollectionCreateParams): Promise<OutlineCollection>;
    updateCollection(params: CollectionUpdateParams): Promise<OutlineCollection>;
    deleteCollection(id: string): Promise<void>;
}
//# sourceMappingURL=outline-client.d.ts.map