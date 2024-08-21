import { Hono } from 'hono'
import { userRouter } from './user'
import { blogRouter } from './blog'
import { middleware } from './middleware/middleware'

const app = new Hono()

app.route('/api/v1/user', userRouter)
app.route('/api/v1/blog', blogRouter)

// DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiOTY5Njg4ZTgtMjRmNC00ZTgzLTk0MzUtMGQzMzRkYTc1NjcwIiwidGVuYW50X2lkIjoiNTMxM2E5Y2QyYjcyY2FmMmRmYzhlZjE2MGNiYTI3ODdjNTM0MDFjMmI3NWU5NDIwNWM3YjY2ZDMzMjU3OTg5NSIsImludGVybmFsX3NlY3JldCI6ImQ2Nzg5YjE2LTllOWMtNGU4OC05ZTU1LWYzNjQ3MThkMjYwNSJ9.S6lIKaSNhLpWMTqoaPojF07qN5nBxgiWbpjMCAeriks"
// DIRECT_URL="<YOUR_DATABASE_CONNECTION_STRING>"

export default app
