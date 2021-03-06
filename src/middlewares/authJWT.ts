import { Request, Response, NextFunction } from 'express'
import jwt from "jsonwebtoken";

import User from "../models/User";
import Todo from '../models/Todo';
import Track from '../models/Track';

const _SECRET: string = 'api+jwt';

interface JwtPayload {
    id: string
  }

  // https://dev.to/kwabenberko/extend-express-s-request-object-with-typescript-declaration-merging-1nn5

export async function verifyToken (req: Request, res: Response, next: NextFunction) {
    console.log("verifyToken");
    
    const token = req.header("x-access-token");
    if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    
    const decoded = jwt.verify(token, _SECRET) as JwtPayload;
    console.log("verifyToken");
    req.userId = decoded.id;
    const user = await User.findById(req.userId, { password: 0 });
    console.log(user);
    if (!user) return res.status(404).json({ message: "No user found" });

    
    next();

  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

export async function isOwnerTodo (req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.userId);

    const todoId = req.params.id;
    const todo = await Todo.findById(todoId);

    if (!todo) return res.status(403).json({ message: "No user found" });

    if (todo.user != req.userId) return res.status(403).json({ message: "Not Owner" });

    next();

  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: error });
  }
};

export async function isOwnerTrack (req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.userId);

    const trackId = req.params.id;
    const track = await Track.findById(trackId);

    if (!track) return res.status(403).json({ message: "No user found" });

    if (track.user != req.userId) return res.status(403).json({ message: "Not Owner" });

    next();

  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: error });
  }
};

