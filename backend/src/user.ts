import { Hono } from "hono"
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signupInput,  signinInput } from "@madhur_dagar/medium_common"
import { SignupType, SigninType } from "@madhur_dagar/medium_common";

export const userRouter = new Hono<{
Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string,
    }
}>();

userRouter.post("/signup", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())

    const body:SignupType = await c.req.json();

    if (!signupInput.safeParse(body).success) {
        return c.json({
            message: "Invalid input"
        })
    }

    try {
        const user = await prisma.user.create({
        data: {
            email: body.email,
            name: body.name,
            password: body.password,
        }
        })

        const token:string = await sign({ id: user.id }, c.env.JWT_SECRET);

        return c.json({
        token: token,
        })

    } catch (err) {
        c.status(403);
        return c.json({
        message: "An error occured while creating the user",
        })
    }

})

userRouter.post("/signin", async (c) => {
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())

    const body:SigninType = await c.req.json();

    if (!signinInput.safeParse(body).success) {
        return c.json({
            message: "Invalid input",
        })
    }

    const user: {email: string, name: string | null, password: string, id: string} | null = await prisma.user.findUnique({
        where: {
        email: body.email,
        password: body.password,
        }
    })


    if (user === null) {
        c.status(403);
        return c.json({
        message: "User not found",
        })
    }
        
    const token:string = await sign({ id: user.id}, c.env.JWT_SECRET);



    return c.json({
        token: token,
    })
})

