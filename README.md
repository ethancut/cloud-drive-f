# Cloud Drive (frontend)

A personal Google Drive-style cloud storage app built to explore how file storage and authentication can be implemented from scratch.

## Tech Stack

**Frontend**

- [Astro](https://astro.build/)

**[Backend](https://github.com/ethancut/cloud-drive-b)**

- [Go](https://go.dev/)
- [pgx](https://github.com/jackc/pgx) - PostgreSQL driver
- [jwt](https://github.com/golang-jwt/jwt) - authentication
- [bcrypt](https://cs.opensource.google/go/x/crypto) - password hashing
- [godotenv](https://github.com/joho/godotenv) - environment variables injection
- [cors](https://github.com/rs/cors) - cross-origin request handling
- [govips](https://github.com/davidbyttow/govips) - image processing
- [uuid](https://github.com/google/uuid) - unique identifier generation

## DEPENDENCIES

- [libvips](https://www.libvips.org/) 8.14+
- [pnpm](https://pnpm.io/) 12.6.0+
- [ffmpeg](https://ffmpeg.org/) 8.0.1+

## Credits

- [Cloud SVG icon](https://www.svgrepo.com/collection/dazzle-line-icons/) - Dazzle Line Icons collection by Dazzle UI
- [Download SVG icon](https://www.svgrepo.com/author/Solar%20Icons/) - Solar Icons

## DEV ENVIROMENT SETUP

- run `pnpm install` in the frontend base directory
- set environment variables (PUBLIC_API_URL - the backend url)
- run `pnpm dev` to start the server
