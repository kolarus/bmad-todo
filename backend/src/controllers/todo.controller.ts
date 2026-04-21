import { Request, Response, NextFunction } from 'express';
import { todoService } from '../services/todo.service';

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const todos = await todoService.findAll();
    res.json(todos);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const todo = await todoService.create(req.body);
    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const todo = await todoService.update(id, req.body);
    if (!todo) {
      return res.status(404).json({
        error: { message: 'Todo not found', code: 'NOT_FOUND', status: 404 },
      });
    }
    res.json(todo);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const todo = await todoService.delete(id);
    if (!todo) {
      return res.status(404).json({
        error: { message: 'Todo not found', code: 'NOT_FOUND', status: 404 },
      });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
