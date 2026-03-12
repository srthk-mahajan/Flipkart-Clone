import { pool } from '../models/db.js';

const isPositiveInteger = (value) => Number.isInteger(Number(value)) && Number(value) > 0;

const sanitizeGuestId = (value) => {
  if (!value) return null;

  const guestId = String(value).trim();
  if (!guestId) return null;

  return /^[a-zA-Z0-9_-]{8,120}$/.test(guestId) ? guestId : null;
};

const buildGuestEmail = (guestId) => `guest+${guestId}@flipkartclone.local`;

export const resolveEffectiveUserId = async (req, queryExecutor = pool) => {
  const explicitUserId = req?.body?.userId ?? req?.query?.userId;

  if (isPositiveInteger(explicitUserId)) {
    return Number(explicitUserId);
  }

  const guestId = sanitizeGuestId(req?.body?.guestId ?? req?.query?.guestId);
  if (guestId) {
    const guestEmail = buildGuestEmail(guestId);
    const result = await queryExecutor.query(
      `
      INSERT INTO users (name, email, password_hash)
      VALUES ('Guest User', $1, NULL)
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
      RETURNING id;
      `,
      [guestEmail]
    );

    return Number(result.rows[0].id);
  }

  return null;
};
