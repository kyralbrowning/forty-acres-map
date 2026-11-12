# Forty Acres Housing Map

Kyra's map of apartments, dorms and houses near UT Austin, with private accounts, saves, "For you" picks and live shared folders.

- Site: https://kyralbrowning.github.io/forty-acres-map/
- Data: the place list lives in the Supabase `places` table (signed-in users only) and is never in this repo. `index.html` loads it after sign-in, then starts `app.js`. The Mission Control apartment scout updates that table on Sundays and Wednesdays.
- Accounts and saves: Supabase project "Forty Acres Housing Map" (tables `hearts`, `prefs`, `folders`, `folder_members`, `folder_places`, all with row-level security). Only the public publishable key is in the page.
- Place ids are slugs of the place name. Don't rename a place unless it really changed, or saved places and folders lose it.
