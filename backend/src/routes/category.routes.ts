import { Router } from 'express';
import { getAllCategories } from '../controllers/category.controller';

const router = Router();

// Public categories list
router.get('/', getAllCategories);

export default router;

