# srnyx's Website

srnyx's official website of very cool random things

## `config.json`

**All values are required!**

- `port`: The port on which the website will run
- `host`: The host on which the website will run. `{PORT}` will be replaced with the value of `port`.
- `mongo`: The MongoDB connection string. This is used to store project data.
- `projects`:
  - `token`: The token used to authenticate with the API. This is used to create/update projects.
  - `retrieve-versions-from-mojang`: Whether to retrieve Minecraft versions from the Mojang API. If `false`, the versions will be retrieved from `minecraft-version.json`.

### Example

```json
{
  "port": 30015,
  "host": "localhost:{PORT}",

  "mongo": "mongodb://username:password@ip:port/database",

  "projects": {
    "token": "token",
    "retrieve-versions-from-mojang": true
  }
}
```

## `minecraft-version.json`

These are cached Minecraft versions from the Mojang API (and custom versions). This is only used if `projects.retrieve-versions-from-mojang` is `false` in `config.json`. Otherwise, the retrieved versions from Mojang are always used.

So this file is only useful if you don't want to use the Mojang API.
