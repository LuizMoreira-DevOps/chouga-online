/**
 * @param {{
 *   env: {
 *     (key: string, defaultValue?: string): string;
 *     int: (key: string, defaultValue?: number) => number;
 *     array: (key: string) => string[];
 *     bool: (key: string, defaultValue?: boolean) => boolean;
 *   };
 * }} config
 */
module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),

  app: {
    keys: env.array("APP_KEYS"),
  },

  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
});
