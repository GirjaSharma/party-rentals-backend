import { auth } from 'express-oauth2-jwt-bearer';
import {getOrCreateUserFromAuth0} from '../services/auth.service.js';

export const checkJwt = auth({
    audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
}) 


export const attachUser =async (req, res, next) =>{
    try{
        console.log('PAYLOAD:', req.auth.payload);

        const {user, memberships} = await getOrCreateUserFromAuth0(req.auth.payload);
        req.dbUser = user;
        req.memberships = memberships;
        next();
    } catch(error){
        console.log('attachUser error:', error);
        res.status(500).json({status: 'error', message: error.message});
    }
}

export const requireBusiness = (req, res, next)=>{
    if(!req.memberships || req.memberships.length === 0){
        return (res.status(403).json({status: 'error', message: 'No business associated with this account.'}))
    }
    req.businessId = req.memberships[0].business_id;
    req.role = req.memberships[0].role;
}