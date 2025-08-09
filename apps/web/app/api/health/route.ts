import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/health:
 *   get:
 *     description: Returns the health status of the application
 *     responses:
 *       200:
 *         description: Application is healthy
 */
export async function GET() {
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
}