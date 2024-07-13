# Frontend part of Style Transfer Project

This is the UI for communication with style tranfer's backend

## Stack

Nextjs + semantic-ui-react

## Usage

Before start, its necesary to have an URL of working backend part

If such URL exists, you can run the app in docker conteiner using this command:

```
docker build -t style-transfer-front . && docker run -it style-transfer-front -e NEXT_PUBLIC_BACKEND_HOST='{backend host}'
```

App running on 3000 port
