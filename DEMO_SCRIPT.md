# Live Demo Script: C&W Market Donor Management

Presenter cheat-sheet for the end-to-end walkthrough (slide 6 roadmap).
Keep this on a second screen or phone. Don't show it to the audience.

---

## 1. Sign in & Dashboard

1. **Log in securely** as an admin, and mention that non-admins get bounced to a no-access page.
2. Land on the **dashboard greeting** with the four headline stats.
3. Hit **Sync** to pull the latest donations from Stripe; point out the "last synced" time.
4. Change the **date range** (1w → 1y / custom) and watch the chart & stats update.
5. Scan **Recent Donations**: amount, donor, time, and whether a thank-you was sent.

**Audience sees:** Total Donations · This Week · Total Donors · Growth Rate · donations-over-time chart · date-range filter · Sync from Stripe.

**Highlight:** data refreshes daily, and growth rate shows **N/A** gracefully when there's no prior week to compare.

---

## 2. Donations & Receipts

1. Open **Donations** and filter & sort the table by amount, date, or status.
2. **Add a non-monetary donation** by hand (e.g. a food donation from a partner).
3. Open a donation to see **donor info, payment & the generated receipt**.
4. Edit the **receipt message**, then **preview the email** before it goes out.
5. **Send** the thank-you and receipt, and the "sent" flag flips.
6. Select several donors and **bulk send** in one click.

**Audience sees:** filter bar · donation detail modal · receipt editor · email preview · bulk send modal · ✓ sent flags.

**Highlight:** receipts are generated automatically from the donation's data, and bulk send reports exactly which emails succeeded, so no donor gets double-thanked.

---

## 3. Donors & Admin

1. Open **Donors** and **search** for someone by name.
2. Click into a **donor profile**: contact info, lifetime stats, full donation history.
3. **Edit donor details** inline and save.
4. Visit **Admin** to manage platform users & roles.
5. Wrap up: show **access control**, where a non-admin is denied the admin page.

**Audience sees:** donor search · contact card · donor stats · donation history · edit modal · users table.

**Highlight:** the donor profile ties every gift back to a person, and admin tools stay locked behind role-based access, so donors never see the data.
