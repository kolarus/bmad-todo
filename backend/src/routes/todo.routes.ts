import { Router } from 'express';
import { validateBody } from '../middleware/validateRequest';
import { todoCreateSchema, todoUpdateSchema } from '../validation/todo.schema';
import { getAll, create, update, remove, removeAll } from '../controllers/todo.controller';

const router = Router();

router.get('/', getAll);
router.post('/', validateBody(todoCreateSchema), create);
router.delete('/', removeAll);
router.patch('/:id', validateBody(todoUpdateSchema), update);
router.delete('/:id', remove);

export default router;
