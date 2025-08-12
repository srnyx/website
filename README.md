# srnyx's Website

srnyx's official website of random things, very cool

# `config.json`

**All values are required!**

- `port`: The port on which the website will run
- `host`: The host on which the website will run. `{PORT}` will be replaced with the value of `port`.

## Example

```json
{
  "port": 30015,
  "host": "localhost:{PORT}"
}
```

# `projects.json`

## Settings

- **`minecraft-versions`**
  - `retrieve-from-mojang`: If true, the website will retrieve the latest Minecraft versions from [Mojang's API](https://launchermeta.mojang.com/mc/game/version_manifest.json). If false, it will use the versions specified by `versions` below.
  - `versions`: A list of Minecraft versions to use if `retrieve-from-mojang` is false. This is useful for testing purposes or if you want to use specific versions without relying on Mojang's API.
- **`defaults`**
  - `author`: The default author for platforms that require it, such as Hangar and GitHub
  - `exact`: A list of fields that should be included in the project item even if they are not specified in the project object. This is useful for repetitive fields that you want to include in every project item.

## Project Item

- If `playforms.github.name` isn't specified, it will default to the project's object key
- You can force exclude `platforms.github` (i.e. no default values) by setting `defaults.github` to `false`

### `minecraft-versions`
This is the `minecraft-versions` field in a project's object, not the top-level setting
- `1.21.4+` means 1.21.4 and all newer versions (inclusive)
- `1.21.4-` means 1.21.4 and all older versions (inclusive)
- `1.20.5-1.21.4` means all versions between 1.20.5 and 1.21.4 (inclusive)

### Examples
- Full
```json
"personal-phantoms": {
  "platforms": {
    "modrinth": "lzjYdd5h",
    "hangar": {
      "author": "srnyx",
      "name": "PersonalPhantoms"
    },
    "spigot": 106381,
    "bukkit": 719645,
    "github": {
      "author": "srnyx",
      "name": "personal-phantoms"
    }
    },
    "loaders": [
      "purpur",
      "paper",
      "spigot"
    ],
    "minecraft-versions": [
      "1.8.8-",
      "1.19-1.20.5",
      "1.21.4",
      "1.21.6+"
    ]
}
```
- **Limited**
  - `platforms.hangar.author` and `platforms.github.author` are `defaults.author`
  - `platforms.github.name` is the object key
  - Any other fields specified in `defaults.exact`
```json
"personal-phantoms": {
  "platforms": {
    "modrinth": "lzjYdd5h",
    "hangar": "PersonalPhantoms",
    "spigot": 106381,
    "bukkit": 719645
  }
}
```
