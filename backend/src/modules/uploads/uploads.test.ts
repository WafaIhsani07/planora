import { describe, it, expect } from "vitest"
import router from "./uploads.routes.js"
import { uploadImageMiddleware } from "../../middlewares/upload.middleware.js"

describe("Uploads Module (Unit Tests)", () => {
  it("should correctly export the express router", () => {
    expect(router).toBeDefined()
    expect(typeof router).toBe("function")
  })

  it("should have POST / route registered", () => {
    const postRoute = router.stack.find(
      (layer: any) => layer.route && layer.route.path === "/" && layer.route.methods?.post
    )
    expect(postRoute).toBeDefined()
  })

  it("should correctly export multer upload middleware instance", () => {
    expect(uploadImageMiddleware).toBeDefined()
    expect(typeof uploadImageMiddleware.single).toBe("function")
    expect(typeof uploadImageMiddleware.array).toBe("function")
  })
})
