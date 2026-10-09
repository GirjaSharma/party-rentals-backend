import {createBusinessForUser} from '../services/businesses.service.js';

export const createBusiness=async(req, res)=>{
    try{
        const { name, timezone, currency} = req.body;

        if(!name || typeof name !== 'string' || name.trim().length === 0){
            return res.status(400).json({status: 'error', message: 'Business name is required.'});
        }

        const business = await createBusinessForUser(req.dbUser.id, {name, timezone, currency});
        res.status(201).json({status: 'ok', business});
    } catch(error){
        console.error('createBusiness error:', error);
        res.status(500).json({status: 'error', message: error.message});
    }
}