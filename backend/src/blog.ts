import { Hono } from "hono"
import { middleware } from "./middleware/middleware"
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";


export const blogRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string
      JWT_SECRET: string,
    },
    Variables : {
          userId: string
      }
  }>();

interface blog {
    id: string,
    title: string,
    content: string,
    published: boolean,
    authorId: string,
}

type blogBody = Pick<blog, "title" | "content" >



blogRouter.use('/*', middleware);


blogRouter.post("/post", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())

    const userId: string = c.get('userId');
    const body: blogBody = await c.req.json();

    try {
        const post: blog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: userId,
            }
        })
        return c.json({
            message: "Blog post successfully created",
            id: post.id,
        })
    } catch (err) {
        return c.json({
            message: "Error occured while creating the blog post",
        })
    }
})

blogRouter.put("/changePost", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())

    const body: {id: string, title?: string, content?: string} = await c.req.json();
    const userId: string = c.get('userId');

    try {
        const updatedPost: blog = await prisma.post.update({
            where: {
                id: body.id,
                authorId: userId,
            },
            data: {
                title: body.title,
                content: body.content,
            }
        })

        return c.json({
            message: "successfully changed the post with id",
            id: updatedPost.id,
        })
    } catch( err) {
        return c.json({
            message: "Unable to update your post with id",
            id: body.id,
        })
    }
})


blogRouter.get("/bulk", async (c) => {
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())

    const allPosts = await prisma.post.findMany({});

    return c.json({
        allPosts,
    })

})

blogRouter.get("/:id", async (c) => {
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())
    
    const id = c.req.param('id');
    
    const post: blog | null = await prisma.post.findUnique({
        where: {
            id: id
        }
    })

    if (post === null) {
        return c.json({
            message: "Post with the following id not found",
        })
    }

    return c.json({
        post
    })
})
  