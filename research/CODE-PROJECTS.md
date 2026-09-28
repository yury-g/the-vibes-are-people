# Public code identity expansion — checked 2026-09-28

Eight additional individual GitHub accounts and four author-attributed code archives match 12 distinct names already in `dist/connections/data.json`. A separate studio association covers Jessica Rosenkrantz without inventing individual repository authorship. No site files were edited.

`profiles.json` keeps the import-compatible `{person, account, source, basis}` shape for individual GitHub profiles. `archives` adds explicit person associations. `public-repository-snapshot.json` contains public unauthenticated GitHub REST metadata, retrieved on the check date, for up to five non-fork repositories from the first 30 results sorted by last push per account. It is a bounded snapshot, not a complete contribution history.

## Identity evidence

- Casey Reas: https://gray.reas.com/information — CODE section directly links https://github.com/REAS. It is the artist's older official subdomain, not a third-party mirror.
- Daniel Shiffman: https://thecodingtrain.com/about — Dan's socials links https://github.com/shiffman. https://shiffman.net/ redirects to The Coding Train.
- Olivia Jack: https://ojack.xyz/about/ — direct GitHub link to https://github.com/ojack.
- Bert Wang-Chak Chan: https://chakazul.github.io/ names Bert Chan; https://chakazul.github.io/lenia.html lists the full-name papers and links https://github.com/Chakazul/Lenia.
- Craig Reynolds: https://www.red3d.com/cwr/ links https://cwreynolds.github.io/ for his software. Its HTML links https://github.com/cwreynolds and text links back to his official home.
- Craig S. Kaplan: https://cs.uwaterloo.ca/~csk/ explicitly lists the GitHub handle isohedral.
- Jared Tarbell: https://www.jaredstarbell.com/about/ explicitly links https://github.com/jaredstarbell?tab=repositories. Notice the account is `jaredstarbell`, not the tempting guessed handle `jaredtarbell`.
- Anders Hoff: search-index rendering of https://inconvergent.net/ identifies Anders Hoff, inconvergent, and Boxtype. https://github.com/inconvergent links this same site and the same original projects/writings. Direct artist-domain retrieval was blocked with 403; source-index text was available. Profile currently displays `ncnvrgnt`, not the full personal name.

## Archives and authorship boundaries

- Donald E. Knuth: https://www-cs-faculty.stanford.edu/~knuth/programs.html links actual source files. Dated examples visible on check: HAMSAT April 2026; ADVENT 5 June 2026. These are authored page dates, not GitHub activity.
- Ken Perlin: https://mrl.cs.nyu.edu/~perlin/noise/ names the author and includes source. Copyright notice exists; no permissive license was verified.
- Robert Bridson: https://www.cs.ubc.ca/~rbridson/ directly links source downloads. Curl noise archive https://www.cs.ubc.ca/~rbridson/download/curlnoise.tar.gz is expressly described as public domain on the author page. Other downloads need their own license check.
- Jesse Louis-Rosenberg: https://n-e-r-v-o-u-s.com/tools/obj/ identifies him as author and links https://github.com/nervoussystem/OBJExport. The repository belongs to a studio account.
- Jessica Rosenkrantz: https://n-e-r-v-o-u-s.com/about_us.php establishes cofounder and creative-director association with Nervous System. This is kept separate from OBJExport authorship.

## Recent work snapshot interpretation

A repository's `pushed_at` is a repository timestamp, not proof the named account holder made that commit or is currently working on it. Collaborators and automation can push. `updated_at` also reflects non-code metadata. Present the date as “repository last push” and link to the repository; avoid “person last worked”. Forks were excluded. Profiles and repositories can contain code, writing, teaching material, or configuration; public availability is not synonymous with an open-source license. The GitHub `license` object is detection metadata, not a full licensing audit.

Examples in the live snapshot include REAS/OmniaExNatura (25 September 2026), cwreynolds/evoflock (28 September 2026), isohedral/heesch-sat (30 August 2026), and jaredstarbell/AsemicIllustrationI (24 September 2026). Keep source timestamps rather than describing these as permanent “recent” facts.

## Not imported

Ben Fry (`benfry`) and Marius Watz (`mariuswatz`) have plausible named primary GitHub profiles with matching context, but this pass did not resolve a sufficiently strong official outbound identity link. Inigo Quilez's domain was unavailable in direct retrieval. Tyler Hobbs has a plausible named GitHub profile but no fresh official outbound link verified. They are deliberately absent from the ready profile list, rather than labeled nonexistent. No private repositories, credentials, or account secrets were accessed.
