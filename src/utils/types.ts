import exp from "constants";
import {  Request } from "express";

export interface CustomRequest extends Request{
   
    user?: any
}

export interface ImageUrl{
    profilePictureUrl:string |undefined;
    coverPictureUrl:string |undefined;
}