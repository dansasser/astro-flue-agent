import * as v from 'valibot';

export function protocolBundleSchema() {
  return v.object({
    eventId: v.string(),
    loadedAt: v.string(),
    protocols: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        description: v.string(),
        scope: v.picklist(['base', 'user']),
        enabled: v.boolean(),
        priority: v.number(),
        appliesTo: v.record(v.string(), v.string()),
        rules: v.array(v.string()),
        source: v.picklist(['sqlite', 'file', 'seed']),
        tags: v.optional(v.array(v.string())),
      }),
    ),
  });
}
