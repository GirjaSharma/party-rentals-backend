import prisma from '../db/prisma.js';

export async function getOrCreateUserFromAuth0(payload){
    const auth0_sub = payload.sub;
    const email = payload[`${process.env.AUTH0_AUDIENCE}/email`] || null;
    const full_name = payload.name || null;

    let user = await prisma.users.findUnique({
        where: {auth0_sub},
        include:{
            memberships: {
                include: {businesses: true}
            }
        }
    });

    if(user){
        return {user, memberships: user.memberships }
    }

    user = await prisma.users.create({
        data: {
            auth0_sub,
            email,
            full_name,
            password_hash: null
        }
    });
    return { user, memberships: []};
}