import express from 'express';
import {checkJwt, attachUser} from '../middleware/auth.js';
import {createBusiness} from '../controllers/businesses.controller.js';

const router = express.Router();

router.post('/', checkJwt, attachUser, createBusiness);

export default router;