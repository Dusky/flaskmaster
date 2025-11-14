import { Pool } from 'pg';

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Query helper
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}

// Transaction helper
export async function transaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Database helpers that match Prisma-like interface
export const db = {
  // Users
  user: {
    findMany: async (options?: {
      select?: any;
      orderBy?: any;
      take?: number;
    }) => {
      const limit = options?.take ? `LIMIT ${options.take}` : '';
      const rows = await query(`
        SELECT
          u.id,
          u.username,
          u.currency_balance as "currencyBalance",
          u.email,
          u.created_at as "createdAt"
        FROM users u
        ORDER BY u.currency_balance DESC
        ${limit}
      `);
      return rows;
    },
    findUnique: async (options: { where: { id?: string; email?: string } }) => {
      const { id, email } = options.where;
      if (id) {
        const rows = await query(`SELECT * FROM users WHERE id = $1`, [id]);
        return rows[0] || null;
      }
      if (email) {
        const rows = await query(`SELECT * FROM users WHERE email = $1`, [email]);
        return rows[0] || null;
      }
      return null;
    },
    create: async (options: { data: any }) => {
      const { email, username, passwordHash, currencyBalance } = options.data;
      const rows = await query(
        `INSERT INTO users (id, email, username, password_hash, currency_balance, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
         RETURNING *`,
        [email, username, passwordHash, currencyBalance || 1000]
      );
      return rows[0];
    },
    update: async (options: { where: { id: string }; data: any }) => {
      const fields = Object.keys(options.data);
      const values = Object.values(options.data);
      const setClause = fields.map((field, i) => {
        const dbField = field === 'currencyBalance' ? 'currency_balance' : field;
        return `${dbField} = $${i + 2}`;
      }).join(', ');

      const rows = await query(
        `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
        [options.where.id, ...values]
      );
      return rows[0];
    },
  },

  // Seasons
  season: {
    findMany: async (options?: { where?: any; include?: any }) => {
      let includeContestants = options?.include?.contestants;

      const rows = await query(`
        SELECT * FROM seasons ORDER BY season_number DESC
      `);

      if (includeContestants) {
        // Fetch contestants for each season
        for (const season of rows) {
          const contestants = await query(
            `SELECT * FROM contestants WHERE season_id = $1 ORDER BY color_index`,
            [season.id]
          );
          (season as any).contestants = contestants;
        }
      }

      return rows;
    },
    findUnique: async (options: { where: { id?: string; seasonNumber?: number }; include?: any }) => {
      let row;
      if (options.where.id) {
        const rows = await query(`SELECT * FROM seasons WHERE id = $1`, [options.where.id]);
        row = rows[0];
      } else if (options.where.seasonNumber) {
        const rows = await query(`SELECT * FROM seasons WHERE season_number = $1`, [options.where.seasonNumber]);
        row = rows[0];
      }

      if (row && options.include?.contestants) {
        const contestants = await query(
          `SELECT * FROM contestants WHERE season_id = $1 ORDER BY color_index`,
          [row.id]
        );
        (row as any).contestants = contestants;
      }

      return row || null;
    },
  },

  // Contestants
  contestant: {
    findMany: async (options?: { where?: any }) => {
      if (options?.where?.seasonId) {
        return query(`SELECT * FROM contestants WHERE season_id = $1 ORDER BY color_index`, [options.where.seasonId]);
      }
      return query(`SELECT * FROM contestants ORDER BY color_index`);
    },
  },

  // Episodes
  episode: {
    findMany: async (options?: { where?: any; orderBy?: any }) => {
      if (options?.where?.seasonId) {
        return query(
          `SELECT * FROM episodes WHERE season_id = $1 ORDER BY episode_number`,
          [options.where.seasonId]
        );
      }
      return query(`SELECT * FROM episodes ORDER BY air_date DESC`);
    },
  },

  // User Picks
  userPick: {
    findFirst: async (options: { where: any }) => {
      const { userId, seasonId, active } = options.where;
      const rows = await query(
        `SELECT * FROM user_picks WHERE user_id = $1 AND season_id = $2 AND active = $3`,
        [userId, seasonId, active]
      );
      return rows[0] || null;
    },
  },
};

export default db;
