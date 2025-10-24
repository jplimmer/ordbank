'server only';

import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { ROUTES } from '../constants/routes';
import { db } from '../db';
import { users } from '../db/schema';
import { getLogger } from '../logger';
import { ServiceResult } from '../types/common';
import { InsertUser, UpdateUser, User } from '../types/user';
import { handleValidationError } from '../utils';
import { userInsertSchema, userUpdateScema } from '../validation/user-schemas';

const logger = getLogger();

export const getCurrentUser = async (): Promise<User | null> => {
  // Authenticate user with Clerk
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return null;
  }

  // Find user in database using clerk_id
  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkUserId),
  });

  // Create user in database if missing (first login)
  if (!dbUser) {
    const result = await createUser({ clerkId: clerkUserId });
    if (!result.success) {
      logger.error('User could not be created');
      return null;
    }

    return result.data;
  }

  return dbUser;
};

export const getCurrentUserOrRedirect = async (): Promise<User> => {
  const user = await getCurrentUser();
  if (!user) {
    logger.info('No current user detected, redirecting to landing page...');
    redirect(ROUTES.HOME);
  }
  return user;
};

const createUser = async (
  newUser: InsertUser
): Promise<ServiceResult<User>> => {
  try {
    // Validate newUser data
    const parseResult = userInsertSchema.safeParse(newUser);

    if (!parseResult.success) {
      const validationError = handleValidationError(
        parseResult.error,
        'Create user'
      );
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validationError.message,
        },
      };
    }

    // Add to database and return new user
    const [user] = await db.insert(users).values(parseResult.data).returning();
    logger.info(`Created new user with id ${user.id}`);
    return { success: true, data: user };
  } catch (error) {
    const errorMsg = 'Failed to create new user';
    logger.error(errorMsg, error);
    return {
      success: false,
      error: { code: 'DATABASE_ERROR', message: errorMsg, details: error },
    };
  }
};

const updateUser = async (
  userId: number,
  updates: UpdateUser
): Promise<ServiceResult<User>> => {
  try {
    // Validate updates
    const parseResult = userUpdateScema.safeParse(updates);

    if (!parseResult.success) {
      const validationError = handleValidationError(
        parseResult.error,
        'Update user'
      );
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: validationError.message },
      };
    }

    // Update user in database and return updated user
    const [updatedUser] = await db
      .update(users)
      .set(parseResult.data)
      .where(eq(users.id, userId))
      .returning();

    logger.info(`Updated user ${updatedUser.id} in database`);
    return { success: true, data: updatedUser };
  } catch (error) {
    const errorMsg = 'Failed to update user';
    logger.error(errorMsg, error);
    return {
      success: false,
      error: { code: 'DATABASE_ERROR', message: errorMsg, details: error },
    };
  }
};
