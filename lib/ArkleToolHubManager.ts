/**
 * ArkleToolHubManager
 * Idea-to-Schema Translation for Mode 3 (Tool Hub)
 */

export interface SchemaField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum';
  label: string;
  options?: string[]; // For enums
  highlight?: string; // CSS color for specific values
}

export interface MetricCard {
  label: string;
  value: string;
  icon: string;
  color: string;
}

export interface ToolSchema {
  name: string;
  tableName: string;
  fields: SchemaField[];
  metrics: MetricCard[];
  theme: {
    primary: string;
  };
}

const TEMPLATE_SCHEMAS: Record<string, ToolSchema> = {
  'lead tracker': {
    name: 'Lead Management System',
    tableName: 'leads',
    fields: [
      { name: 'name', type: 'string', label: 'Full Name' },
      { name: 'email', type: 'string', label: 'Email' },
      { name: 'status', type: 'enum', label: 'Status', options: ['New', 'Contacted', 'Qualified', 'Closed'] },
      { name: 'value', type: 'number', label: 'Deal Value' }
    ],
    metrics: [
      { label: 'Total Leads', value: '124', icon: 'groups', color: 'blue' },
      { label: 'Conversion Rate', value: '18%', icon: 'trending_up', color: 'emerald' }
    ],
    theme: { primary: '#3b82f6' }
  },
  'inventory': {
    name: 'Inventory Hub',
    tableName: 'products',
    fields: [
      { name: 'sku', type: 'string', label: 'SKU' },
      { name: 'productName', type: 'string', label: 'Product Name' },
      { name: 'stock', type: 'number', label: 'In Stock' },
      { name: 'price', type: 'number', label: 'Price' }
    ],
    metrics: [
      { label: 'Total Stock', value: '8,400', icon: 'inventory_2', color: 'indigo' },
      { label: 'Low Stock Alert', value: '12', icon: 'warning', color: 'rose' }
    ],
    theme: { primary: '#6366f1' }
  }
};

/**
 * Translates a natural language goal into a functional tool schema
 */
export const generateDatabaseSchema = (goal: string): ToolSchema => {
  const p = goal.toLowerCase();
  let schema: ToolSchema;

  // Basic Template Matching
  if (p.includes('lead') || p.includes('crm') || p.includes('real estate')) {
    schema = { ...TEMPLATE_SCHEMAS['lead tracker'] };
  } else if (p.includes('inventory') || p.includes('product') || p.includes('stock')) {
    schema = { ...TEMPLATE_SCHEMAS['inventory'] };
  } else {
    // Default generic tool
    schema = {
      name: 'Custom Utility Tool',
      tableName: 'entries',
      fields: [{ name: 'title', type: 'string', label: 'Title' }],
      metrics: [{ label: 'Entries', value: '0', icon: 'database', color: 'slate' }],
      theme: { primary: '#0f172a' }
    };
  }

  // Conversational Customization
  if (p.includes('priority')) {
    schema.fields.push({ 
      name: 'priority', 
      type: 'enum', 
      label: 'Priority', 
      options: ['Low', 'Medium', 'High'],
      highlight: 'gold' 
    });
    schema.metrics.push({ label: 'High Priority', value: '4', icon: 'priority_high', color: 'amber' });
  }

  return schema;
};
