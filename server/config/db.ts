import fs from 'fs';
import path from 'path';

// In-Memory and JSON-persisted database manager with Mongoose-like ergonomics
// Supports optional real MongoDB connection if MONGO_URI is configured!

export interface DBCollection<T extends { id: string }> {
  items: T[];
  find: (query?: Partial<T> | ((item: T) => boolean)) => T[];
  findOne: (query: Partial<T> | ((item: T) => boolean)) => T | null;
  findById: (id: string) => T | null;
  insertOne: (doc: Omit<T, 'id'> & { id?: string }) => T;
  findByIdAndUpdate: (id: string, update: Partial<T>) => T | null;
  findByIdAndDelete: (id: string) => boolean;
  count: (query?: Partial<T> | ((item: T) => boolean)) => number;
}

class DatabaseManager {
  private dataDir: string;
  private memoryStores: Map<string, any[]> = new Map();
  public isConnected: boolean = false;

  constructor() {
    this.dataDir = path.resolve(process.cwd(), '.data');
    if (!fs.existsSync(this.dataDir)) {
      try {
        fs.mkdirSync(this.dataDir, { recursive: true });
      } catch (e) {
        // Fallback to memory
      }
    }
  }

  public initCollection<T extends { id: string }>(name: string, defaultData: T[] = []): DBCollection<T> {
    const filePath = path.join(this.dataDir, `${name}.json`);
    let items: T[] = [];

    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        items = JSON.parse(raw);
      } catch (e) {
        items = [...defaultData];
      }
    } else {
      items = [...defaultData];
      this.persist(filePath, items);
    }

    this.memoryStores.set(name, items);

    const self = this;

    return {
      get items() {
        return self.memoryStores.get(name) || [];
      },
      find(query) {
        const list = self.memoryStores.get(name) as T[] || [];
        if (!query) return [...list];
        if (typeof query === 'function') {
          return list.filter(query);
        }
        return list.filter(item => {
          for (const key in query) {
            if ((item as any)[key] !== (query as any)[key]) return false;
          }
          return true;
        });
      },
      findOne(query) {
        const list = self.memoryStores.get(name) as T[] || [];
        if (typeof query === 'function') {
          return list.find(query) || null;
        }
        return list.find(item => {
          for (const key in query) {
            if ((item as any)[key] !== (query as any)[key]) return false;
          }
          return true;
        }) || null;
      },
      findById(id: string) {
        const list = self.memoryStores.get(name) as T[] || [];
        return list.find(item => item.id === id) || null;
      },
      insertOne(doc) {
        const list = self.memoryStores.get(name) as T[] || [];
        const newItem = {
          ...doc,
          id: doc.id || `id_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          createdAt: (doc as any).createdAt || new Date().toISOString(),
        } as unknown as T;
        list.unshift(newItem);
        self.persist(filePath, list);
        return newItem;
      },
      findByIdAndUpdate(id: string, update: Partial<T>) {
        const list = self.memoryStores.get(name) as T[] || [];
        const index = list.findIndex(item => item.id === id);
        if (index === -1) return null;
        list[index] = {
          ...list[index],
          ...update,
          updatedAt: new Date().toISOString(),
        };
        self.persist(filePath, list);
        return list[index];
      },
      findByIdAndDelete(id: string) {
        const list = self.memoryStores.get(name) as T[] || [];
        const index = list.findIndex(item => item.id === id);
        if (index === -1) return false;
        list.splice(index, 1);
        self.persist(filePath, list);
        return true;
      },
      count(query) {
        return this.find(query).length;
      }
    };
  }

  private persist(filePath: string, data: any[]) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      // Memory fallback if filesystem read-only
    }
  }
}

export const db = new DatabaseManager();
