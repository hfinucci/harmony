import { io } from 'socket.io-client';
import {BASE_URI} from "./utils.ts";

export const socket = io(BASE_URI)