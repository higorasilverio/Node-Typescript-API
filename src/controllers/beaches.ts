import mongoose from 'mongoose';
import { Controller, Post } from '@overnightjs/core';
import { Beach } from '@src/models/beach';
import { Request, Response } from 'express';

@Controller('beaches')
export class BeachesController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const beach = new Beach(req.body);
      const result = await beach.save();
      res.status(201).send(result);
    } catch (err: unknown) {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(422).send({ error: (err as Error).message });
      } else {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    }
  }
}
