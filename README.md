# SocialPostGPT.xyz

Hello there 👋

Welcome to the source code of [SocialPostGPT.xyz](https://socialpostgpt.xyz).

We are using:
- [Wasp](https://wasp-lang.dev) as our full-stack framework
- [OpenAI](https://openai.com)'s ChatGPT
- [Unsplash](https://unsplash.com) and [Pexels](https://pexels.com) for stock photos


Here's a quick overview of how things work:

![shapes](https://user-images.githubusercontent.com/2223680/228483785-61cca62a-9161-4c9c-a751-9e7f44645b1a.png)

- based on the user input (text + some choices)
- ask ChatGPT to produce two things:
  - a catchy social media post content
  - good, generic search keywords for stock photos
- search for the photos on Unsplash and Pexels
- combine everything into the final result!

### Running it locally

Copy `env.example` to `.env.server` and fill in the values.

You'll need a PostgreSQL running locally. You can use Docker to run one:

```bash
docker run --name daily-ai-comics-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

Make sure you have Wasp installed ([installing Wasp](https://wasp-lang.dev/docs#2-installation)), then run:

```bash
wasp db migrate-dev
```

and then:

```bash
wasp start
```

### Deploying to Fly.io

Make sure you have the Fly CLI installed, then run:

```bash
wasp deploy fly launch <name> <region> # first time
```

where `<name>` is some unique app name and `<region>` is one of [Fly.io regions](https://fly.io/docs/reference/regions/).

```bash
wasp deploy fly deploy # subsequent times
```
