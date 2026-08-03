---
title: Usage Policy
editLink: false
---

# Usage Policy

**The short version:** Pengu Loader itself is safe — it only restyles the League
Client's interface and never touches the game. But it is a third-party tool that
Riot Games does not endorse, so it sits in a gray area. What gets people banned
is not Pengu, it's what some people choose to build on top of it.

## Where the gray area is

The League Client is an embedded Chromium browser. Pengu Loader loads your
JavaScript and CSS into that interface, the same way a browser extension styles
a web page.

That is not something Riot officially supports. There is no approval process for
Client modifications and no public list of what is or isn't allowed, so nobody —
including us — can promise you that using any third-party tool carries zero
risk. Anyone telling you a Client mod is "100% ban-proof" is guessing.

What we can tell you is what Pengu actually does, so you can judge the risk
yourself.

## What Pengu Loader does not do

- **It never touches the game.** Pengu only runs inside `LeagueClientUx.exe`,
  the process that draws the Client UI. The game process is never loaded into,
  read from, or modified. Nothing Pengu does can reach a live match.
- **It does not read or write game memory.**
- **It does not automate gameplay** — no scripting, no input simulation, no
  bots.
- **It does not give you information you couldn't already see** in the Client.
- **It does not touch your account credentials.** Pengu never sees your
  username, password, or session tokens.

## What will get you banned

Pengu Loader is a platform. A plugin runs with full access to the Client's own
APIs, which means a plugin author can do things Riot will absolutely act on.
Using a plugin that does any of the following puts your account at risk, and
that risk is on you:

- **Automation of any kind** — auto-accept queue is the common one, but also
  auto-dodge, auto-ban/pick bots, or anything that plays for you.
- **Scripting or gameplay assistance**, in the Client or in game.
- **Exploiting bugs** in the Client or the LCU API, including anything that
  grants content, currency, or ranked outcomes you didn't earn.
- **Spamming or abusing LCU endpoints**, such as mass-messaging, friend-request
  floods, or lobby spam.
- **Boosting, account sharing, or evading restrictions** with the help of a
  plugin.
- **Anything that gives you an unfair advantage** over other players.

None of this becomes acceptable because it went through Pengu. Riot's
[Terms of Service](https://www.riotgames.com/en/terms-of-service) apply to your
account no matter what tool was involved.

::: warning Install plugins you trust

A plugin is ordinary JavaScript with full access to the Client. Treat one like
any other program you run: prefer plugins whose source you can read, be
suspicious of obfuscated code, and remember that a plugin promising an edge in
matchmaking is exactly the kind that gets accounts banned.

:::

## Themes and cosmetic plugins

Purely visual work — CSS themes, custom backgrounds, layout tweaks, new UI
panels — is what Pengu Loader was built for, and it's what the overwhelming
majority of the community uses it for. It changes nothing another player can
see and gives you no advantage.

## Privacy

Pengu Loader collects nothing. There is no telemetry, no analytics, no crash
reporting, and no account is required.

The application makes exactly one outbound network request of its own: a check
against the [public GitHub releases API][gh] to see whether a newer version
exists. It sends no personal data, and you can turn it off with the
**automatic update check** toggle in the Pengu hub.

Anything else your Client talks to is either Riot's own services or a request
made by a plugin you installed. Plugins are not sandboxed from the network, so a
plugin can make its own requests — another reason to install ones you trust.

[gh]: https://api.github.com/repos/PenguLoader/PenguLoader/releases/latest

## No warranty

Pengu Loader is free, open source, and provided as-is under the
[MIT License](https://github.com/PenguLoader/PenguLoader/blob/main/LICENSE).
There is no warranty. You install and use it at your own risk, and you are
responsible for what you and your plugins do with your account.

If you aren't comfortable with that, don't install it — that's a completely
reasonable call.

## Questions

Ask in the [Discord server](https://chat.pengu.lol) or open an issue on
[GitHub](https://github.com/PenguLoader/PenguLoader).

---

Pengu Loader isn't endorsed by Riot Games and doesn't reflect the views or
opinions of Riot Games or anyone officially involved in producing or managing
Riot Games properties. Riot Games, and all associated properties are trademarks
or registered trademarks of Riot Games, Inc.
