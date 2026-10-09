import prisma from '../db/prisma.js';

export const createBusinessForUser = async(userId, {name, timezone, currency})=>{
    return prisma.$transaction(async (tx) => {
        const business = await tx.businesses.create({
            data: {
                name,
                timezone: timezone || 'UTC',
                currency: currency || 'USD'
            },
        });

        await tx.memberships.create({
            data: {
                user_id: userId,
                business_id: business.id,
                role: 'owner'
            }
        });
        return business;
    })
}