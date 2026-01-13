import type { OutlineConfig, OutlineCollection, OutlineDocument, OutlineSearchResult, DocumentListParams, DocumentSearchParams, DocumentCreateParams, DocumentUpdateParams, DocumentMoveParams } from './types.js';
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
}
//# sourceMappingURL=outline-client.d.ts.map