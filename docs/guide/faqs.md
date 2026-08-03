# FAQs

<p align=center>
  <img src="/lol-banner.png" />
</p>

## Can I get banned?

Pengu Loader itself is safe — it only restyles the League Client's interface and
never touches the game. Themes and cosmetic plugins give you no advantage over
anyone else, which is what the vast majority of people use it for.

That said, it is a third-party tool that Riot Games does not endorse, so it sits
in a gray area, and nobody can honestly promise you zero risk. What actually
gets accounts banned isn't Pengu — it's what some plugins do with it. Automation
(auto-accept, auto-dodge, bots), scripting, exploiting Client or LCU bugs, or
anything giving you an unfair advantage is bannable no matter which tool it went
through.

So: install plugins you trust, keep it cosmetic, and you're doing what Pengu was
built for. See the [Usage Policy](/policy) for the full picture.

## Does it affect the in-game?

No. Pengu Loader only runs inside `LeagueClientUx.exe`, the process that draws
the Client interface. It never loads into the game process, so nothing it does
can reach a live match.

## Regions support?

Pengu Loader works for all regions, including Tencent server.

## MacOS support?

Yes, since v1.2. Separate builds are available for Apple Silicon and Intel Macs
on the [Download](/download) page.

## Reloading the Client causes high memory usage?

The League Client is designed for single loading only. If you reload it using
the Ctrl+Shift+R key or via Chrome DevTools, the Client will reload its
interface. But there will be mostly old resources, that may cause memory leaks.

## RunDLL error?

Your antivirus ate/blocked the Loader's core DLL.

## Missing runtime?

Try installing the
[VC++ 2015-2019](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170)
runtime.

## LeagueClientUx.exe - System Error?

Make sure you have been deactivated the Loader before removing it.

## The Client looks like Discord glass themes?

Check out the
[Acrylical theme](https://github.com/PrincessAkira/league-launcher-theme/tree/main/Acrylical),
or some similar themes.

For theme developers, you should use the [Effect API](../runtime-api/effect) in
your theme.

## Followed the instructions, but the plugin/theme does not work?

If you have renamed some files, make sure that this File Explorer option is unchecked,
and then check your file names again.

![](https://i.imgur.com/SUFr9Qk.png)

## My v0.6.0 and v1.0.1 did not work?

After LoL patch 13.8, all previous versions will not work anymore due to 64-bit
Client update. Please download the latest version right now.
