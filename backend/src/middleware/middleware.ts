import { MiddlewareHandler } from "hono";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";

const app = new Hono<{
    Bindings: {
        JWT_SECRET: string,
    }
}>();

type tokenObj = string | undefined;

export const middleware: MiddlewareHandler = async(c, next) => {
    const Bearer_token: tokenObj  = c.req.header('Authorization');
    
    if (Bearer_token === undefined) {
        c.status(401);
        return c.json({
            message: "Token undefined",
        })
    }
    
    const token: string = Bearer_token.split(" ")[1];
    
    try {
        const payload: JWTPayload = await verify(token, c.env.JWT_SECRET);
        
        if (!payload) {
            c.status(401);
            return c.json({
                message: "Error occured while verifying the JWT token",
            })
        }
        
        c.set('userId', payload.id);
        console.log("in the middleware, going next");
        await next();
    } catch (err) {
        c.status(401);
        return c.json({
            message: "Error occured while verifying the JWT token",
        })
    }

}