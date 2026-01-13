import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { OutlineClient } from './outline-client.js';

export function registerTools(server: McpServer, client: OutlineClient): void {
  // outline_search - Search documents by query
  server.tool(
    'outline_search',
    'Search documents in Outline wiki by query',
    {
      query: z.string().describe('Search query string'),
      collectionId: z.string().optional().describe('Filter by collection ID'),
      includeArchived: z.boolean().optional().describe('Include archived documents'),
      includeDrafts: z.boolean().optional().describe('Include draft documents')
    },
    async ({ query, collectionId, includeArchived, includeDrafts }) => {
      const results = await client.searchDocuments({
        query,
        collectionId,
        includeArchived,
        includeDrafts
      });

      const formatted = results.map((r) => ({
        id: r.document.id,
        title: r.document.title,
        context: r.context,
        collectionId: r.document.collectionId,
        updatedAt: r.document.updatedAt
      }));

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(formatted, null, 2)
          }
        ]
      };
    }
  );

  // outline_get_document - Get document content by ID
  server.tool(
    'outline_get_document',
    'Get a document by ID or URL ID, returns full markdown content',
    {
      id: z.string().describe('Document ID or URL ID')
    },
    async ({ id }) => {
      const doc = await client.getDocument(id);

      return {
        content: [
          {
            type: 'text' as const,
            text: `# ${doc.title}\n\n${doc.text}`
          }
        ]
      };
    }
  );

  // outline_list_collections - List all collections
  server.tool(
    'outline_list_collections',
    'List all collections in the Outline workspace',
    {},
    async () => {
      const collections = await client.listCollections();

      const formatted = collections.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description
      }));

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(formatted, null, 2)
          }
        ]
      };
    }
  );

  // outline_list_documents - List documents in a collection
  server.tool(
    'outline_list_documents',
    'List documents, optionally filtered by collection',
    {
      collectionId: z.string().optional().describe('Filter by collection ID'),
      parentDocumentId: z.string().optional().describe('Filter by parent document ID')
    },
    async ({ collectionId, parentDocumentId }) => {
      const docs = await client.listDocuments({ collectionId, parentDocumentId });

      const formatted = docs.map((d) => ({
        id: d.id,
        title: d.title,
        collectionId: d.collectionId,
        parentDocumentId: d.parentDocumentId,
        updatedAt: d.updatedAt
      }));

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(formatted, null, 2)
          }
        ]
      };
    }
  );

  // outline_create_document - Create a new document
  server.tool(
    'outline_create_document',
    'Create a new document in Outline',
    {
      title: z.string().describe('Document title'),
      text: z.string().optional().describe('Document content in markdown'),
      collectionId: z.string().describe('Collection ID to create document in'),
      parentDocumentId: z.string().optional().describe('Parent document ID for nested documents'),
      publish: z.boolean().optional().describe('Publish immediately (default: true)')
    },
    async ({ title, text, collectionId, parentDocumentId, publish }) => {
      const doc = await client.createDocument({
        title,
        text,
        collectionId,
        parentDocumentId,
        publish: publish ?? true
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                id: doc.id,
                urlId: doc.urlId,
                title: doc.title,
                collectionId: doc.collectionId,
                createdAt: doc.createdAt
              },
              null,
              2
            )
          }
        ]
      };
    }
  );

  // outline_update_document - Update an existing document
  server.tool(
    'outline_update_document',
    'Update an existing document in Outline',
    {
      id: z.string().describe('Document ID to update'),
      title: z.string().optional().describe('New document title'),
      text: z.string().optional().describe('New document content in markdown'),
      append: z.boolean().optional().describe('Append text instead of replacing'),
      publish: z.boolean().optional().describe('Publish the document')
    },
    async ({ id, title, text, append, publish }) => {
      const doc = await client.updateDocument({
        id,
        title,
        text,
        append,
        publish
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                id: doc.id,
                title: doc.title,
                updatedAt: doc.updatedAt
              },
              null,
              2
            )
          }
        ]
      };
    }
  );

  // outline_move_document - Move document to different collection/parent
  server.tool(
    'outline_move_document',
    'Move a document to a different collection or parent document',
    {
      id: z.string().describe('Document ID to move'),
      collectionId: z.string().optional().describe('Target collection ID'),
      parentDocumentId: z
        .string()
        .nullable()
        .optional()
        .describe('Target parent document ID (null for root level)')
    },
    async ({ id, collectionId, parentDocumentId }) => {
      const docs = await client.moveDocument({
        id,
        collectionId,
        parentDocumentId
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                moved: docs.length,
                documents: docs.map((d) => ({
                  id: d.id,
                  title: d.title,
                  collectionId: d.collectionId
                }))
              },
              null,
              2
            )
          }
        ]
      };
    }
  );
}
